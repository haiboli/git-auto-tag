#!/usr/bin/env node

let args = process.argv
let cmd = require('commander'),
  chalk = require('chalk'),
  shell = require('shelljs')
moment = require('moment');
/**
 * git 批量删除
 */
cmd
  .version('0.1.0')
  .option('-w, --who', 'for tag with name')
  .option('-b, --branch', 'for tag with branch')
  // .option('-a, --all', 'for tag with name and branch')
  .description('自动打tag')
  .parse(args)

// 判断git命令是否可用
if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git')
  shell.exit(1)
}
let time = moment()
  .format('YYYYMMDDHHmmss')
let remote = shell.exec(`git remote -v | grep 3590/vfe/ | grep fetch`)
if (remote) {
  remote = remote.split(/\s/)[0]
  // 生成带有分支名称的tag
  if (cmd.branch) {
    let branch = shell.exec(`git branch | grep "*"`)
    console.log(chalk.blue('-------------------'))
    if (branch) {
      let branch_name = branch.split('* ')[1].split('\\n')[0]
      let tag = `t${time}-${branch_name}`
      shell.exec(`git tag ${tag}`)
      console.log(chalk.blue(`生成tag: ${tag}`))
      shell.exec(`git push ${remote} ${tag}`)
    }
  }

  // 生成带有用户名称的tag
  else if (cmd.who) {
    let name = shell.exec(`git config user.name`)
    console.log(chalk.blue('-------------------'))
    if (name) {
      shell.exec(`git tag t${time}-${name}`)
      console.log(chalk.blue(`生成tag: t${time}-${name}`))
      shell.exec(`git push ${remote} t${time}-${name}`)
    }
  }

  // 生成带有分支名称和用户名的tag
  else if (cmd.all) {
    let name = shell.exec(`git config user.name`)
    let branch = shell.exec(`git branch | grep "*"`)
    console.log(chalk.blue('-------------------'))
    if (name && branch) {
      let branch_name = branch.split('* ')[1].split('\\n')[0]
      let str = `t${time}-${branch_name}-${name}`
      shell.exec(`git tag t${time}-${branch_name}-${name}`)
      console.log(chalk.blue(`生成tag: t${time}-${branch_name}-${name}`))
    }
  }

  else {
    shell.exec(`git tag ${time}`)
    console.log(chalk.blue(`生成tag: t${time}`))
    shell.exec(`git push ${remote} ${time}`)
  }
}
