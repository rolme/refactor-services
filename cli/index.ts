#!/usr/bin/env node

import * as dotenv from 'dotenv';
dotenv.config();

// TODO: this hack ends the node process with a non-zero exit code
// and spits back the exact promise rejection error message.
process.on('unhandledRejection', (reason) => {
  console.error(reason);
  process.exit(1);
});

import './polyfills';

import * as program from 'commander';
import UserActions from './src /actions/user-actions';

program
  .command('create <entity>')
  .description('create an entity such as a user, habit, or task')
  .alias('c')
  .option('-e, --email', 'email')
  .option('-p, --password', 'password')
  .option('-uid, --user-id', 'user id')
  .option('-hid, --habit-id', 'user id')
  .option('-d, --d', 'description')
  .option('-t, --t', 'time')
  .action((entity, args) => {
    switch (entity.toLowerCase()) {
      case 'user':
        new UserActions(args.email, args.password).create();
        break;
      case 'habit':
        console.log(`habit: ${args}`);
        break;
      case 'task':
        console.log(`task: ${args}`);
        break;
    }
  });

program
  .command('list <entity>')
  .description(
    'list entities such as users, habits, or taskslist existing profiles',
  )
  .alias('ls')
  .option(
    '-l, --list',
    'list entities such as users, habits, or taskslist existing profiles',
  )
  .action((entity, args) => {
    switch (entity.toLowerCase()) {
      case 'user':
        new UserActions().list();
        break;
      case 'habit':
        console.log(`habit: ${args}`);
        break;
      case 'task':
        console.log(`task: ${args}`);
        break;
    }
  });

program.parse(process.argv);
