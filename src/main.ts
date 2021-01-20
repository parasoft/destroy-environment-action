/// <reference path="typings/parasoft-em-api.d.ts" />

import * as core from '@actions/core'
import http = require('http');
import https = require('https');
import q = require('q');
import url = require('url');
import {wait} from './wait'

var emBaseURL = url.parse(core.getInput('ctpUrl'));
if (emBaseURL.path === '/') {
    emBaseURL.path = '/em';
} else if (emBaseURL.path === '/em/') {
    emBaseURL.path = '/em';
}
var protocol : any = emBaseURL.protocol === 'https:' ? https : http;
var protocolLabel = emBaseURL.protocol || 'http:';
var username = core.getInput('ctpUsername');

var getFromEM = function<T>(path: string) : q.Promise<T>{
  var def = q.defer<T>();
  var options = {
      host: emBaseURL.hostname,
      port: emBaseURL.port,
      path: emBaseURL.path + path,
      headers: {
          'Accept': 'application/json'
      }
  }
  if (protocolLabel === 'https:') {
      options['rejectUnauthorized'] = false;
      options['agent'] = false;
  }
  if (username) {
      options['auth'] = username + ':' +  core.getInput('ctpPassword');
  }
  console.log('GET ' + protocolLabel + '//' + options.host + ':' + options.port + options.path);
  var responseString = "";
  protocol.get(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
          responseString += chunk;
      });
      res.on('end', () => {
          console.log('    response ' + res.statusCode + ':  ' + responseString);
          var responseObject = JSON.parse(responseString);
          def.resolve(responseObject);
      });
  }).on('error', (e) => {
      def.reject(e);
  });
  return def.promise;
};

var findInEM = function<T>(path: string, property: string, name: string, otherProperty?:string, otherMatch?: number) : q.Promise<T>{
    var def = q.defer<T>();
    var options = {
        host: emBaseURL.hostname,
        port: emBaseURL.port,
        path: emBaseURL.path + path,
        headers: {
            'Accept': 'application/json'
        }
    }
    if (protocolLabel === 'https:') {
        options['rejectUnauthorized'] = false;
        options['agent'] = false;
    }
    if (username) {
        options['auth'] = username + ':' +  core.getInput('ctpPassword');
    }
    console.log('GET ' + protocolLabel + '//' + options.host + ':' + options.port + options.path);
    var responseString = "";
    protocol.get(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            responseString += chunk;
        });
        res.on('end', () => {
            console.log('    response ' + res.statusCode + ':  ' + responseString);
            var responseObject = JSON.parse(responseString);
            if (typeof responseObject[property] === 'undefined') {
                def.reject(property + ' does not exist in response object from ' + path);
                return;
            }
            for (var i = 0; i < responseObject[property].length; i++) {
				if (otherProperty && otherMatch) {
					if (responseObject[property][i][otherProperty] !== otherMatch) {
						continue;
					}
				}
                if (responseObject[property][i].name === name) {
                    def.resolve(responseObject[property][i]);
                    return;
                }
            }
            def.reject('Could not find name "' + name + '" in ' + property + ' from ' + path);
            return;
        });
    }).on('error', (e) => {
        def.reject(e);
    });
    return def.promise;
};

var deleteFromEM = function<T>(path: string) : q.Promise<T>{
    var def = q.defer<T>();
    var options = {
        host: emBaseURL.hostname,
        port: emBaseURL.port,
        path: emBaseURL.path + path,
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    }
    if (protocolLabel === 'https:') {
        options['rejectUnauthorized'] = false;
        options['agent'] = false;
    }
	if (username) {
		options['auth'] = username + ':' +  core.getInput('ctpPassword');
	}
    console.log('DELETE ' + protocolLabel + '//' + options.host + ':' + options.port + options.path);
    var responseString = "";
    protocol.get(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            responseString += chunk;
        });
        res.on('end', () => {
            console.log('    response ' + res.statusCode + ':  ' + responseString);
            var responseObject = JSON.parse(responseString);
            def.resolve(responseObject);
        });
    }).on('error', (e) => {
        def.reject(e);
    });
    return def.promise;
}

async function run(): Promise<void> {
  var systemName = core.getInput('system');
  var systemId;
  var environmentName = core.getInput('environment');
  var environmentId;

  return findInEM<EMSystem>('/api/v2/systems', 'systems', systemName).then((system: EMSystem) => {
      core.debug('Found system ' + system.name + ' with id ' + system.id);
      systemId = system.id;
      return findInEM<EMEnvironment>('/api/v2/environments', 'environments', environmentName, 'systemId', systemId);
  }).then((environment: EMEnvironment) => {
      environmentId = environment.id;
	  return deleteFromEM<EMEnvironment>('/api/v2/environments/' + environmentId + '?recursive=true');
  }).then((res: EMEnvironment) => {
		if (res.name) {
			core.debug('Successfully deleted ' + res.name);
		} else {
            core.error('Failed to delete environment: ' + environmentName);
            core.setFailed('Failed to delete environment: ' + environmentName);
		}
	}).catch((e) => {
		core.setFailed(e.message);
	});
}

run();
