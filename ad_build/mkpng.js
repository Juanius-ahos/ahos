const sharp = require('sharp');
const fs = require('fs');

function lowerThird(text, file){
  const svg = `<svg width="1080" height="420" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="8" flood-color="#000" flood-opacity="0.7"/></filter></defs>
    <rect x="90" y="150" width="900" height="130" rx="18" fill="#0a0a0b" fill-opacity="0.5"/>
    <rect x="90" y="150" width="8" height="130" fill="#ff6a1a"/>
    <text x="540" y="232" font-family="Arial, 'Segoe UI', sans-serif" font-weight="900" font-size="58" fill="#ffffff" text-anchor="middle" filter="url(#s)">${text}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toFile(file);
}

async function endcard(){
  const svg = `<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <rect width="1080" height="1920" fill="#0a0a0b"/>
    <radialGradient id="g" cx="50%" cy="38%" r="60%">
      <stop offset="0%" stop-color="#ff6a1a" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="#ff6a1a" stop-opacity="0"/>
    </radialGradient>
    <rect width="1080" height="1920" fill="url(#g)"/>
    <text x="540" y="360" font-family="'Consolas',monospace" font-weight="700" font-size="30" letter-spacing="8" fill="#9a948c" text-anchor="middle">WEBSITES   APPS   SOFTWARE</text>
    <text x="540" y="1120" font-family="Arial,'Segoe UI',sans-serif" font-weight="900" font-size="130" fill="#ff6a1a" text-anchor="middle">ahos.xyz</text>
    <text x="540" y="1230" font-family="Arial,'Segoe UI',sans-serif" font-weight="700" font-size="52" fill="#ede8e0" text-anchor="middle">Start a project</text>
    <rect x="390" y="1300" width="300" height="76" rx="38" fill="none" stroke="#ff6a1a" stroke-width="2"/>
    <text x="540" y="1350" font-family="Arial,sans-serif" font-weight="700" font-size="34" fill="#ff6a1a" text-anchor="middle">Beirut → Worldwide</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile('C:/Users/Samer/Downloads/AHOS-site-main/ad_build/endcard_bg.png');
  const logo = await sharp('C:/Users/Samer/Downloads/AHOS-site-main/ad_build/logo.png').resize({width:420}).toBuffer();
  const meta = await sharp(logo).metadata();
  await sharp('C:/Users/Samer/Downloads/AHOS-site-main/ad_build/endcard_bg.png').composite([{input:logo, top:620, left:Math.round((1080-420)/2)}]).png().toFile('C:/Users/Samer/Downloads/AHOS-site-main/ad_build/endcard.png');
}

(async()=>{
  await lowerThird('Websites built in Beirut','C:/Users/Samer/Downloads/AHOS-site-main/ad_build/s1.png');
  await lowerThird('Fast, modern, made to convert','C:/Users/Samer/Downloads/AHOS-site-main/ad_build/s2.png');
  await lowerThird('Live in days, not months','C:/Users/Samer/Downloads/AHOS-site-main/ad_build/s3.png');
  await endcard();
  console.log('PNGs generated');
})().catch(e=>{console.error(e);process.exit(1);});
