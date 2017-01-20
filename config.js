'use strict';

const vscode = require('vscode');

function getConfiguration() {
  return vscode.workspace.getConfiguration('mocha');
}

exports.env = function env() {
  return getConfiguration().env;
};

exports.options = function options() {
  return getConfiguration().options;
};

exports.node_options = function options() {
  return getConfiguration().node_options;
};

exports.files = function files() {
  return getConfiguration().files;
};