const fs = require("fs");
const checkModule = fs.existsSync(__dirname + "/../node_modules");

if (!checkModule) {
  console.log(
    `Please run "pnpm install" or "npm install" to use CLI Interface!`
  );
  process.exit();
}

const yargs = require("yargs");
const chalk = require("chalk");
const { exec } = require("child_process");

yargs
  .command({
    command: "dev",
    description:
      "Run application using development environment (changes main.hbs)",
    builder: {
      npm: {
        describe: "Run this command using NPM",
        type: "boolean",
      },
    },
    handler(argv) {
      console.log(chalk.bgBlue.black("Writing main.hbs file..."));
      const data = fs.readFileSync(__dirname + "/../utils/main.hbs", "utf8");
      fs.writeFileSync(
        __dirname + "/../views/templates/main.hbs",
        data,
        "utf8"
      );
      if (argv.npm) {
        console.log(
          chalk`This command runs {bgGreen.white.bold npm start} and {bgGreen.white.bold npm run watch}.`
        );
        console.log(chalk`Press {bgRed.white.bold CTRL + C} to stop.`);
        exec("npm start", (err, stdout) => {
          if (err) throw err;
          console.log(chalk`Starting {bgGreen.white.bold npm start}`);
          console.log(stdout);
        });
        exec("npm run watch", (err, stdout) => {
          if (err) throw err;
          console.log(chalk`Starting {bgGreen.white.bold npm run watch}`);
          console.log(stdout);
        });
      } else {
        console.log(
          chalk`This command runs {bgGreen.white.bold pnpm start} and {bgGreen.white.bold pnpm watch}. If you use npm please add --npm flags.`
        );
        console.log(chalk`Press {bgRed.white.bold CTRL + C} to stop.`);
        exec("pnpm start", (err, stdout) => {
          if (err) throw err;
          console.log(chalk`Starting {bgGreen.white.bold pnpm start}`);
          console.log(stdout);
        });
        exec("pnpm watch", (err, stdout) => {
          if (err) throw err;
          console.log(chalk`Starting {bgGreen.white.bold pnpm watch}`);
          console.log(stdout);
        });
      }
    },
  })
  .demandCommand();

yargs.command({
  command: "build",
  description:
    "Build application using production environment (changes main.hbs)",
  builder: {
    npm: {
      describe: "Run this command using NPM",
      type: "boolean",
    },
  },
  handler(argv) {
    console.log(chalk.bgBlue.black("Writing main.hbs file..."));
    const data = fs.readFileSync(__dirname + "/../utils/main.min.hbs", "utf8");
    fs.writeFileSync(__dirname + "/../views/templates/main.hbs", data, "utf8");
    if (argv.npm) {
      console.log(
        chalk`This command runs {bgGreen.white.bold node index.js} and {bgGreen.white.bold npm run build}.`
      );
      console.log(chalk`Press {bgRed.white.bold CTRL + C} to stop.`);
      exec("node index.js", (err, stdout) => {
        if (err) throw err;
        console.log(chalk`Starting {bgGreen.white.bold node index.js}`);
        console.log(stdout);
      });
      exec("npm run build", (err, stdout) => {
        if (err) throw err;
        console.log(chalk`Starting {bgGreen.white.bold npm run build}`);
        console.log(stdout);
      });
    } else {
      console.log(
        chalk`This command runs {bgGreen.white.bold node index.js} and {bgGreen.white.bold pnpm build}. If you use npm please add --npm flags.`
      );
      console.log(chalk`Press {bgRed.white.bold CTRL + C} to stop.`);
      exec("node index.js", (err, stdout) => {
        if (err) throw err;
        console.log(chalk`Starting {bgGreen.white.bold node index.js}`);
        console.log(stdout);
      });
      exec("pnpm build", (err, stdout) => {
        if (err) throw err;
        console.log(chalk`Starting {bgGreen.white.bold pnpm build}`);
        console.log(stdout);
      });
    }
  },
});

yargs.parse();
