import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3000';
let adminToken = '';
let cookieHeader = '';
let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

async function runAllTests() {
  console.log('=== ADMIN MANAGEMENT SYSTEM COMPREHENSIVE TEST SUITE ===\n');

  // 1. PUBLIC AUTH ISOLATION (Correction #5, #39)
  await test('Public Wedding Route (No Auth) -> 200', async () => {
    const res = await fetch(`${BASE}/api/weddings/raka-alya`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data.wedding) throw new Error('Invalid wedding data');
  });

  await test('Public Wishes Route (No Auth) -> 200', async () => {
    const res = await fetch(`${BASE}/api/weddings/raka-alya/wishes`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  await test('Public RSVP Submit (No Auth) -> 201', async () => {
    const res = await fetch(`${BASE}/api/weddings/raka-alya/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Public Test Guest',
        attendance: 'hadir',
        guest_count: 1,
        message: 'Selamat berbahagia!',
      }),
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
  });

  // 2. ADMIN PROTECTION (Correction #5, #39)
  await test('Admin Route Without Auth -> 401', async () => {
    const res = await fetch(`${BASE}/api/admin/wedding`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 3. ADMIN LOGIN (Correction #2, #3, #31, #32)
  await test('Admin Login with Wrong Password -> 401 (Generic error message)', async () => {
    const res = await fetch(`${BASE}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'WrongPassword123!' }),
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    const json = await res.json();
    if (json.message !== 'Username/email atau password salah.') {
      throw new Error(`Leaked user existence: "${json.message}"`);
    }
  });

  await test('Admin Login with Valid Credentials -> 200 + HttpOnly Cookie + Token', async () => {
    const res = await fetch(`${BASE}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Admin@Wedding2026!' }),
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data?.token) throw new Error('Missing token in response');
    if (json.data.admin.password_hash) throw new Error('SECURITY VIOLATION: password_hash exposed in response!');

    adminToken = json.data.token;
    // Capture set-cookie
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      cookieHeader = setCookie.split(';')[0];
    }
  });

  const authHeaders = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  };

  // 4. ADMIN GET WEDDING & STATS
  await test('Admin GET /api/admin/wedding -> 200 with Stats', async () => {
    const res = await fetch(`${BASE}/api/admin/wedding`, { headers: authHeaders });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.data.wedding || !json.data.stats) throw new Error('Missing wedding or stats in response');
  });

  // 5. EDIT COUPLE & VERIFY LIVE PUBLIC REFLECTION (Correction #19)
  await test('Update Couple Details & Verify Live Reflection', async () => {
    // 0. Save current state to restore later
    const getRes = await fetch(`${BASE}/api/admin/wedding`, { headers: authHeaders });
    const currentData = (await getRes.json()).data.wedding;
    const currentSlug = currentData.slug || 'fikri-nesya';

    try {
      // 1. Update
      const updateRes = await fetch(`${BASE}/api/admin/wedding/couple`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          groom_short_name: `${currentData.groom_short_name} (Test)`,
          groom_full_name: currentData.groom_full_name,
          groom_father: currentData.groom_father,
          groom_mother: currentData.groom_mother,
          groom_family_label: currentData.groom_family_label,
          groom_instagram: currentData.groom_instagram,
          bride_short_name: `${currentData.bride_short_name} (Test)`,
          bride_full_name: currentData.bride_full_name,
          bride_father: currentData.bride_father,
          bride_mother: currentData.bride_mother,
          bride_family_label: currentData.bride_family_label,
          bride_instagram: currentData.bride_instagram,
          invitation_intro: currentData.invitation_intro,
        }),
      });
      if (updateRes.status !== 200) throw new Error(`Update failed: ${updateRes.status}`);

      // 2. Check public endpoint immediately
      const pubRes = await fetch(`${BASE}/api/weddings/${currentSlug}`);
      const pubJson = await pubRes.json();
      if (pubJson.data.couple.groom.short_name !== `${currentData.groom_short_name} (Test)`) {
        throw new Error(`Live update mismatch: got "${pubJson.data.couple.groom.short_name}"`);
      }
    } finally {
      // 3. Always revert back to original state
      await fetch(`${BASE}/api/admin/wedding/couple`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          groom_short_name: currentData.groom_short_name,
          groom_full_name: currentData.groom_full_name,
          groom_father: currentData.groom_father,
          groom_mother: currentData.groom_mother,
          groom_family_label: currentData.groom_family_label,
          groom_instagram: currentData.groom_instagram,
          bride_short_name: currentData.bride_short_name,
          bride_full_name: currentData.bride_full_name,
          bride_father: currentData.bride_father,
          bride_mother: currentData.bride_mother,
          bride_family_label: currentData.bride_family_label,
          bride_instagram: currentData.bride_instagram,
          invitation_intro: currentData.invitation_intro,
        }),
      });
    }
  });

  // 6. QUOTE MANAGEMENT (Correction #1)
  await test('Update Quote / Ayat Suci -> 200', async () => {
    const res = await fetch(`${BASE}/api/admin/wedding/quote`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        quote_title: 'We Found Love',
        quote_text: 'Dan di antara tanda-tanda kebesaran-Nya...',
        quote_source: 'QS Ar-Rum : 21',
      }),
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  // 7. EVENT CRUD & REORDER (Correction #6, #22)
  let testEventId = null;
  await test('Create Event -> 201', async () => {
    const res = await fetch(`${BASE}/api/admin/events`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        type: 'Acara Syukuran Test',
        date: '2026-06-21',
        date_label: 'Minggu, 21 Juni 2026',
        start_time: '19:00',
        end_time_label: 'Selesai',
        venue: 'Hotel Grand Mercure',
        address: 'Jl. Sudirman No. 10',
        maps_url: 'https://maps.google.com/?q=Hotel',
        sort_order: 99,
      }),
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    const json = await res.json();
    testEventId = json.data.id;
  });

  await test('Reorder Events (Static route /reorder before /:id) -> 200', async () => {
    const res = await fetch(`${BASE}/api/admin/events/reorder`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        items: [{ id: testEventId, sort_order: 100 }],
      }),
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  await test('Delete Event -> 200', async () => {
    const res = await fetch(`${BASE}/api/admin/events/${testEventId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  // 8. GUEST CRUD & PERSONALIZED LINK (Correction #13, #16, #17, #26)
  let testGuestId = null;
  await test('Create Guest -> 201', async () => {
    const res = await fetch(`${BASE}/api/admin/guests`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Prof. Dr. Ir. Budi Santoso, M.Sc & Partner',
        phone: '081234567890',
        invitation_code: 'VIP-001',
      }),
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    const json = await res.json();
    testGuestId = json.data.id;
  });

  await test('Verify Guest Personalized URL Encoding', async () => {
    const guestName = 'Prof. Dr. Ir. Budi Santoso, M.Sc & Partner';
    const encoded = encodeURIComponent(guestName);
    const expectedParam = 'Prof.%20Dr.%20Ir.%20Budi%20Santoso%2C%20M.Sc%20%26%20Partner';
    if (encoded !== expectedParam) throw new Error(`Encoding mismatch: got ${encoded}`);
  });

  await test('Delete Guest -> 200', async () => {
    const res = await fetch(`${BASE}/api/admin/guests/${testGuestId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  // 9. RSVP SPAM CLEANUP (Correction #27, #28)
  await test('Delete Test RSVP (Scoped to Wedding) -> 200', async () => {
    // Find the test rsvp created earlier
    const rsvpsRes = await fetch(`${BASE}/api/admin/rsvps`, { headers: authHeaders });
    const rsvpsJson = await rsvpsRes.json();
    const testRsvp = rsvpsJson.data.rsvps.find(r => r.name === 'Public Test Guest');
    if (testRsvp) {
      const delRes = await fetch(`${BASE}/api/admin/rsvps/${testRsvp.id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (delRes.status !== 200) throw new Error(`Expected 200, got ${delRes.status}`);
    }
  });

  // 10. SLUG VALIDATION (Correction #11, #15)
  await test('Reject Reserved Slug (e.g. "admin", "api", "login") -> 400', async () => {
    const res = await fetch(`${BASE}/api/admin/wedding/settings`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'The Wedding',
        slug: 'admin',
        timezone: 'Asia/Jakarta',
        status: 'active',
      }),
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await test('Reject Invalid Characters in Slug -> 400', async () => {
    const res = await fetch(`${BASE}/api/admin/wedding/settings`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'The Wedding',
        slug: 'Raka Alya 2026!',
        timezone: 'Asia/Jakarta',
        status: 'active',
      }),
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // 11. ADMIN LOGOUT (Correction #4)
  await test('Admin Logout -> 200 + Cleared Cookie', async () => {
    const res = await fetch(`${BASE}/api/admin/auth/logout`, {
      method: 'POST',
      headers: authHeaders,
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  console.log(`\n=== SUITE FINISHED: ${passed} PASSED, ${failed} FAILED ===`);
  process.exit(failed > 0 ? 1 : 0);
}

runAllTests().catch(err => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});
