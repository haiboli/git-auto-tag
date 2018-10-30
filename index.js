#!/usr/bin/env node
let args = process.argv
let cmd = require('commander'),
  chalk = require('chalk'),
  shell = require('shelljs');
/**
 * git 批量删除
 */
cmd
  .version('0.1.0')
  .option('-w, --who', 'for tag with name')
  .option('-b, --branch', 'for tag with branch')
  .option('-a, --all', 'for tag with name and branch')
  .description('自动打tag')
  .parse(args)

// 判断git命令是否可用
if(!shell.which('git')) {
  shell.echo('Sorry, this script requires git')
  shell.exit(1)
}
if(cmd.who) {
  console.log(chalk.blue('生成tYYYYMMDD-name'))
  console.log(shell.exec(`git branch`))
}
if(cmd.include) {
  console.log(chalk.blue('生成tYYYYMMDD-branch'))
  shell.exec(`git branch | grep -E ${str} | xArgs git branch -D`)
}
if(cmd.exclude) {
  console.log(chalk.blue('生成tYYYYMMDD-branch-name'))
  shell.exec(`git branch | grep -vE ${str} | xArgs git branch -D`)
}
