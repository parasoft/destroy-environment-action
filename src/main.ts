/// <reference path="typings/parasoft-em-api.d.ts" />

import * as core from '@actions/core';
import * as service from './service';
export async function run(): Promise<void> {
    var ctpEndpoint = core.getInput('ctpUrl', { required: true });
    var ctpUsername = core.getInput('ctpUsername', { required: true });
    var ctpPassword = core.getInput('ctpPassword', { required: true });
    var ctpService = new service.WebService(ctpEndpoint, 'em', { username: ctpUsername, password: ctpPassword });
    var systemName = core.getInput('system', { required: true });
    var systemId;
    var environmentName = core.getInput('environment', { required: true });
    var environmentId;

  return ctpService.findInEM<EMSystem>('/api/v2/systems', 'systems', systemName).then((system: EMSystem) => {
      core.debug('Found system ' + system.name + ' with id ' + system.id);
      systemId = system.id;
      return ctpService.findInEM<EMEnvironment>('/api/v2/environments', 'environments', environmentName, 'systemId', systemId);
  }).then((environment: EMEnvironment) => {
      environmentId = environment.id;
	  return ctpService.deleteFromEM<EMEnvironment>('/api/v2/environments/' + environmentId + '?recursive=true');
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