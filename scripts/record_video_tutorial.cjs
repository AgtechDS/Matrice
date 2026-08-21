/**
 * Video Tutorial Generator & Screen Automation for Matrice del Destino
 * Directly automates the LIVE web interface at 1080x1920 @ 60 FPS
 * Records: Tour Guidato, Modulo Guidato, Ottagramma Sacro, 22 Arcani, Griglia 3x3 e Chat Oracolare
 */

const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

function startStaticServer(publicDir) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg'
  };

  const server = http.createServer((req, res) => {
    try {
      const parsedUrl = new URL(req.url, 'http://127.0.0.1');
      let reqPath = parsedUrl.pathname;
      if (reqPath === '/') reqPath = '/index.html';
      
      const filePath = path.join(publicDir, reqPath);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    } catch (err) {
      res.writeHead(500);
      res.end('Server Error');
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, url: `http://127.0.0.1:${port}` });
    });
    server.on('error', reject);
  });
}

async function recordLiveTutorial(options = {}) {
  const publicDir = path.resolve(__dirname, '../public');
  const { server, url: serverUrl } = await startStaticServer(publicDir);

  const {
    durationSec = 34,
    outputPath = path.resolve(__dirname, '../output/social_tutorials/live_matrice_tutorial.webm'),
    scenario = 'walkthrough_full',
    profileData = {
      name: 'Sara Esposito',
      date: '1995-09-24',
      time: '14:30',
      place: 'Roma'
    }
  } = options;

  console.log(`🎬 [Matrice Live UI Recorder] Starting Playwright (1080x1920 @ 60 FPS)...`);
  console.log(`🌐 Local HTTP Server: ${serverUrl}`);
  console.log(`🎭 Tutorial Scenario: ${scenario}`);
  console.log(`⏱️ Target Duration: ${durationSec}s`);
  console.log(`💾 Output Path: ${outputPath}`);

  const outputDir = path.dirname(path.resolve(outputPath));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-web-security',
      '--disable-infobars',
      '--enable-font-antialiasing',
      '--force-device-scale-factor=1',
      '--force-dark-mode',
      '--background-color=#090d16',
      '--enable-webgl',
      '--use-gl=angle',
      '--enable-accelerated-2d-canvas'
    ]
  });

  const tempDir = path.join(outputDir, '_temp_live_rec_' + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    recordVideo: {
      dir: tempDir,
      size: { width: 1080, height: 1920 }
    }
  });

  const page = await context.newPage();

  // Inject session mocks
  await page.addInitScript(() => {
    localStorage.setItem('destiny_credits', '100');
    localStorage.setItem('cookie_consent', 'true');
    localStorage.setItem('md_legal_footer_hidden', 'true');
  });

  await page.goto(serverUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(800);

  // Setup mobile vertical styling optimizations
  await page.evaluate(() => {
    document.body.classList.add('mobile-screen-recording');
    const footer = document.getElementById('app-footer');
    if (footer) footer.style.display = 'none';
  });

  console.log(`🚀 Executing Live UI Sequences: ${scenario}...`);

  if (scenario === 'walkthrough_full') {
    // 1. Initial State & Spotlight Greeting (0 - 3s)
    await page.waitForTimeout(2200);

    // 2. Open Wizard Modal (3s - 8s)
    await page.evaluate(() => {
      if (typeof openWizardModal === 'function') openWizardModal();
    });
    await page.waitForTimeout(1000);

    // Fill form fields
    await page.evaluate(({ p }) => {
      const n = document.getElementById('wz-name');
      const d = document.getElementById('wz-date');
      const t = document.getElementById('wz-time');
      const pl = document.getElementById('wz-place');
      if (n) n.value = p.name;
      if (d) d.value = p.date;
      if (t) t.value = p.time;
      if (pl) pl.value = p.place;
    }, { p: profileData });
    await page.waitForTimeout(1500);

    // Submit wizard
    await page.evaluate(() => {
      if (typeof submitWizardData === 'function') submitWizardData();
    });
    await page.waitForTimeout(2000);

    // 3. Focus on Sacred Ottagramma & Interactive Nodes (8s - 16s)
    await page.evaluate(() => {
      if (typeof setMobileView === 'function') setMobileView('matrix');
      if (typeof selectNode === 'function') selectNode('C', 15);
    });
    await page.waitForTimeout(2500);

    await page.evaluate(() => {
      if (typeof selectNode === 'function') selectNode('E', 20);
    });
    await page.waitForTimeout(2000);

    // 4. Switch Tabs: 22 Arcani & Griglia 3x3 (16s - 23s)
    await page.evaluate(() => {
      if (typeof switchSidebarTab === 'function') switchSidebarTab('arcana');
    });
    await page.waitForTimeout(2500);

    await page.evaluate(() => {
      if (typeof switchSidebarTab === 'function') switchSidebarTab('grid');
    });
    await page.waitForTimeout(2500);

    // 5. Switch to Chat & Trigger Oracular Consult (23s - 32s)
    await page.evaluate(() => {
      if (typeof setMobileView === 'function') setMobileView('chat');
    });
    await page.waitForTimeout(1200);

    await page.evaluate(() => {
      if (typeof startAscendantCalculation === 'function') startAscendantCalculation();
    });
    await page.waitForTimeout(3000);
  } else if (scenario === 'ascendant_focus') {
    // Focus on Ascendant & Celestial Transits
    await page.evaluate(({ p }) => {
      if (typeof updateMatrixVisualization === 'function') updateMatrixVisualization(p.name, p.date);
      if (typeof saveUserProfile === 'function') saveUserProfile(p, false);
      if (typeof loadUserProfile === 'function') loadUserProfile();
      if (typeof setMobileView === 'function') setMobileView('chat');
    }, { p: profileData });
    await page.waitForTimeout(2000);

    await page.evaluate(() => {
      if (typeof startAscendantCalculation === 'function') startAscendantCalculation();
    });
    await page.waitForTimeout(5000);
  } else if (scenario === 'synastry_focus') {
    // Focus on Synastry modal
    await page.evaluate(() => {
      if (typeof openSynastryModal === 'function') openSynastryModal();
    });
    await page.waitForTimeout(1500);

    await page.evaluate(() => {
      const n1 = document.getElementById('syn-name-1');
      const d1 = document.getElementById('syn-date-1');
      const n2 = document.getElementById('syn-name-2');
      const d2 = document.getElementById('syn-date-2');
      if (n1) n1.value = 'Sara';
      if (d1) d1.value = '1995-09-24';
      if (n2) n2.value = 'Alessandro';
      if (d2) d2.value = '1992-03-18';
    });
    await page.waitForTimeout(2000);

    await page.evaluate(() => {
      if (typeof submitSynastryCalculation === 'function') submitSynastryCalculation();
    });
    await page.waitForTimeout(4000);
  }

  const remaining = Math.max(0, Math.round((durationSec - 2) * 1000));
  await page.waitForTimeout(remaining);

  const videoObj = page.video();
  await page.close();
  await context.close();
  await browser.close();
  server.close();

  if (videoObj) {
    const rawPath = await videoObj.path();
    if (fs.existsSync(rawPath)) {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      fs.copyFileSync(rawPath, outputPath);
      console.log(`✅ [Matrice Live UI Recorder] Video saved: ${outputPath}`);

      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {}

      return outputPath;
    }
  }

  throw new Error("Recording failed: no video file produced");
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let duration = 30;
  let scenario = 'walkthrough_full';
  let out = path.resolve(__dirname, '../output/social_tutorials/live_matrice_tutorial.webm');

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--duration' && args[i + 1]) duration = parseFloat(args[i + 1]);
    if (args[i] === '--scenario' && args[i + 1]) scenario = args[i + 1];
    if (args[i] === '--output' && args[i + 1]) out = path.resolve(args[i + 1]);
  }

  recordLiveTutorial({ durationSec: duration, scenario, outputPath: out })
    .then(p => {
      console.log(`🎉 Master Video Captured: ${p}`);
      process.exit(0);
    })
    .catch(err => {
      console.error(`❌ Error: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { recordLiveTutorial };
