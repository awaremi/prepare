#!/usr/bin/env node  
"use strict";
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const color = require('colors-cli/safe')
require('colors-cli/toxic')
const loading = require('loading-cli')
const fetch = require('node-fetch')
const readlineSync = require('readline-sync')
const fs = require('fs')

const url = "http://localhost:8080" 
let arg = {}

const load = loading("loading".green)
load.frame(['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'])


function setup(){

  const optionDefinitions = [
      { name: 'platform', alias: 'p', type: String, description: 'Project platform, ie: ng (Angular) or boot (Spring Boot)' },
      { name: 'component', alias: 'c', type: String, description: 'Component type to be generated' },
      { name: 'input', alias: 'i', type: String, typeLabel: 'JSON {underline file}', description: 'Configuration / input parameter'},
      { name: 'output', alias: 'o', type: String, typeLabel: '{underline folder}', description: 'Target folder to put generated file/files'},
      { name: 'interactive', alias: 't', type: String, typeLabel: 'output JSON {underline file}', description: 'Interactive mode, input file will be ignored' },
      { name: 'help', alias: 'h', type: Boolean, description: 'Option description' },
    ]

  arg = commandLineArgs(optionDefinitions)

  const sections = [
    { header: 'Prepare', content: 'Generating skeleton and application component source code files, to help programmer developing databases application'},
    { header: 'Options', optionList: optionDefinitions },
    { header: 'Example', content: 'prepare -p ng -c retrieval -n balance -i definition.json'},
  ]

  const usage = commandLineUsage(sections)

  if (arg.help) {
    console.log(usage)
    return false
  }

  return true

}

async function interactive(){

  load.start()
  const sections = await new Promise((outcome) => fetch(`${url}/lines/${arg.platform}/${arg.component}`, {method: 'GET'})
      .then(res => res.json())
      .then(body => outcome(body)))

  load.stop()
  
  let outcome = {}

  for (let s = 0; s < sections.length; s++){

    if (sections[s].list){

      let length = readlineSync.questionInt(color.yellow(sections[s].prompt))
      if (length <= 0) continue
      outcome[sections[s].section] = new Array(length);
      for (let n = 0; n < length; n++){
        console.log(color.white(mustache.render(sections[s].list.prompt, {n: n + 1})))
        outcome[sections[s].section][n] = {}
        for (let d = 0; d < sections[s].list.detail.length; d++){
          outcome[sections[s].section][n][sections[s].list.detail[d].item] = readlineSync.question(color.green(sections[s].list.detail[d].prompt));
        } 
      }

    } 
    
    if (sections[s].detail) {

      outcome[sections[s].section] = {}
      for (let d = 0; d < sections[s].detail.length; d++){
        outcome[sections[s].section][sections[s].detail[d].item] = readlineSync.question(color.green(sections[s].detail[d].prompt));
      } 

    }

  }

  fs.writeFile(arg.interactive, JSON.stringify(outcome, null, 4), (err) => {})
  console.log('configuration file created !!!'.green)

}

async function generate(){

  load.start()
  let files = []
  try {

    const config = JSON.parse(fs.readFileSync(arg.input, "utf8"))
    files = await new Promise((outcome, error) => fetch(`${url}/generate/${arg.platform}/${arg.component}/${arg.name}`, 
        {method: 'POST', body: JSON.stringify(config), headers: { 'Content-Type': 'application/json' }})
        .then(res => res.json())
        .then(body => outcome(body))
        .catch(err => error(err)))

    if (files.error) {
      console.error(files.message)
      return;
    }

  } finally {
    load.stop()
  }

  let root = ''
  
  if (arg.output) {
    root = arg.output;
    if (!root.endsWith('/')) 
    root = root + '/'
    fs.mkdirSync(root, { recursive: true })
  }

  for (let file in files) {
    console.log(root + file)
    fs.writeFile(root + file, files[file], (err) => {
      console.error('fail to write ' + (root + file).red)
    })
  } 

  console.log('files written'.green)

}

if (!setup()) return

if (arg.interactive) {
  interactive()
  return
}

generate()
