import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3000';

async function testUploadSecurity() {
  console.log('=== TESTING UPLOAD SECURITY ===\n');

  // 1. Login to get token
  const loginRes = await fetch(`${BASE}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Admin@Wedding2026!' }),
  });
  const loginJson = await loginRes.json();
  const token = loginJson.data?.token;

  // 2. Test Spoofed File (Fake PNG that is actually plain text)
  console.log('Test 1: Upload spoofed file (plain text named fake.png)...');
  const fakeFormData = new FormData();
  const fakeBlob = new Blob(['THIS IS NOT AN IMAGE BUT SCRIPT CODE!'], { type: 'image/png' });
  fakeFormData.append('file', fakeBlob, 'fake.png');
  fakeFormData.append('photo_type', 'cover');

  const spoofRes = await fetch(`${BASE}/api/admin/wedding/upload-photo`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fakeFormData,
  });

  const spoofJson = await spoofRes.json();
  if (spoofRes.status === 400) {
    console.log('[PASS] Spoofed file was rejected with HTTP 400:', spoofJson.message);
  } else {
    throw new Error(`SECURITY FAIL: Spoofed file was accepted with status ${spoofRes.status}!`);
  }

  // 3. Test Valid Image (Real 1x1 PNG bytes)
  console.log('\nTest 2: Upload valid PNG image (1x1 pixel with valid magic bytes)...');
  // 1x1 transparent PNG binary bytes
  const realPngBytes = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
    0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
    0x42, 0x60, 0x82
  ]);

  const validFormData = new FormData();
  const validBlob = new Blob([realPngBytes], { type: 'image/png' });
  validFormData.append('file', validBlob, 'test_cover.png');
  validFormData.append('photo_type', 'cover');

  const validRes = await fetch(`${BASE}/api/admin/wedding/upload-photo`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: validFormData,
  });

  const validJson = await validRes.json();
  if (validRes.status === 200 && validJson.success) {
    console.log('[PASS] Valid PNG was accepted with HTTP 200. Uploaded URL:', validJson.data.url);
  } else {
    throw new Error(`Upload valid PNG failed: status ${validRes.status} message: ${validJson.message}`);
  }

  // 4. Test Reverting Cover Photo to default /images/cover.svg
  console.log('\nTest 3: Revert Cover Photo to default SVG...');
  import('../src/db/pool.js').then(async ({ default: pool }) => {
    await pool.query("UPDATE weddings SET cover_photo = '/images/cover.svg' WHERE slug = 'raka-alya'");
    console.log('[PASS] Reverted cover photo to default SVG.');
    await pool.end();
    console.log('\n=== ALL UPLOAD SECURITY TESTS PASSED ===');
    process.exit(0);
  });
}

testUploadSecurity().catch(e => {
  console.error(e);
  process.exit(1);
});