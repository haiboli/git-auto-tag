#!/usr/bin/env node

let args = process.argv
let program = require('commander'),
  chalk = require('chalk'),
  shell = require('shelljs'),
  moment = require('moment'),
  fs = require("fs"),
  ini = require('ini'),
  path = require('path');

let TAGRC = path.join(process.env.HOME, '.tagrc');
let PKG = require('./package.json');

program
  .version(PKG.version)

/**
 * git 批量删除
 */
program
  .option('-w, --who', 'for tag with name')
  .option('-b, --branch', 'for tag with branch')
  .option('-t, --time', 'format for time')
  .description('自动打tag')

/**
 * 设置push仓库
 */
program
  .command('remote <remote_name>')
  .alias('r')
  .description('set remote name, Default: origin')
  .action((remote_name) => {
    let config = getCustomInI()
    cmdValue = 'remote'
    config['remote'] = {}
    config['remote'].name = remote_name
    setCustomInI(config)
  })

/**
 * 设置tag格式
 */
program
  .command('time <format>')
  .alias('t')
  .description('set time format, Default: YYYYMMDDHHmmss')
  .action((format) => {
    let config = getCustomInI()
    cmdValue = 'time'
    config['time'] = {}
    config['time'].name = format
    setCustomInI(config)
  })

program
  .parse(args)

if (typeof cmdValue === 'undefined') {
  addTag()
}


/*//////////////// helper methods /////////////////*/

function addTag() {
  // 判断git命令是否可用
  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git')
    shell.exit(1)
  }
  let config = getCustomInI();
  let remote = 'origin';
  let format = 'YYYYMMDDHHmmss'
  if(config && config.remote && config.remote.name) {
    remote = config.remote.name
  }
  if(config && config.time && config.time.name) {
    format = config.time.name
  }
  let time = moment()
    .format(format);

  // 生成带有分支名称的tag
  if (program.branch) {
    let branch = shell.exec(`git branch | grep "*"`, {silent:true})
    console.log(chalk.blue('-------------------'))
    if (branch) {
      let branch_name = branch.split('* ')[1].split('\\n')[0]
      let tag = `t${time}-${branch_name}`
      shell.exec(`git tag ${tag}`, {silent:true})
      console.log(chalk.blue(`生成tag: ${tag}`))
      shell.exec(`git push ${remote} ${tag}`)
    }
  }

  // 生成带有用户名称的tag
  else if (program.who) {
    let name = shell.exec(`git config user.name`, {silent:true})
    console.log(chalk.blue('-------------------'))
    if (name) {
      shell.exec(`git tag t${time}-${name}`, {silent:true})
      console.log(chalk.blue(`生成tag: t${time}-${name}`))
      shell.exec(`git push ${remote} t${time}-${name}`)
    }
  } else {
    shell.exec(`git tag t${time}`, {silent:true})
    console.log(chalk.blue(`生成tag: t${time}`))
    let res = shell.exec(`git push ${remote} t${time}`)
  }
}

function getCustomInI() {
  return fs.existsSync(TAGRC) ? ini.parse(fs.readFileSync(TAGRC, 'utf-8')) : {}
}

function setCustomInI(config, cb) {
  let res = shell.ShellString(ini.stringify(config)).to(TAGRC)
}
