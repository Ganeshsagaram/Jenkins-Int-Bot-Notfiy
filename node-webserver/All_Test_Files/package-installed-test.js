import util from 'util';

const moduleName = 'webex-node-bot-framework';

try {
  const mod = await import(moduleName);
  const Framework = mod.default || mod.Framework || mod;

  console.log(`\n🔍 Methods in '${moduleName}':\n`);

  const prototypeMethods = Object.getOwnPropertyNames(Framework.prototype)
    .filter(m => m !== 'constructor');

  prototypeMethods.forEach(method => {
    console.log(`- ${method} (function)`);
  });

  console.log(`\n🔧 Full inspection of prototype:\n`);
  console.log(util.inspect(Framework.prototype, { showHidden: false, depth: 1, colors: true }));

} catch (err) {
  console.error(`❌ Failed to import '${moduleName}':`, err.message);
}
