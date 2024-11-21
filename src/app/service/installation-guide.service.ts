import { Injectable } from '@angular/core';
import { IInstallationStep } from '../interface/installation-step';

@Injectable({
  providedIn: 'root'
})
export class InstallationGuideService {
  private windowsFullsteps: IInstallationStep[] = [
    { description: 'Download the Modpack from our website.' },
    { description: 'Unzip the downloaded file.' },
    { description: 'Double click the installer to start the installer.' },
    { description: 'Follow the instructions from the installer and select the folder (path) you want to install.', remark: 'Remember to BACKUP all the data before installing the modpack if you have another modpack installed in the same folder before!' },
    { description: 'After the installation is done, you can start the game using Minecraft launcher you like.', remark: 'Remember to select the correct mod loader version of the game, adjust the memory settings if needed, and the Java version to use.' }
  ];
  private windowsPatchsteps: IInstallationStep[] = [
    { description: 'Download the Modpack from our website.' },
    { description: 'Unzip the downloaded file.' },
    { description: 'Double click the installer to start the installer.' },
    { description: 'Follow the instructions from the installer and select the folder (path) you installed our modpack before.', remark: 'You must select the previously installed folder (path) since the installer may not only add some new mods but also remove some old mods and edit some config files! So please DO NOT create an empty folder as the path!' }
  ];

  constructor() { }

  getInstallationSteps(os: string, method: string): IInstallationStep[] {
    if (os === 'windows') {
      if (method === 'full') {
        return this.windowsFullsteps;
      } else if (method === 'patch') {
        return this.windowsPatchsteps;
      }
    }
    return [];
  }

  getInstallationImage(os: string, method: string, stepNum: number): string {
    return `assets/images/installations/${os}/${method}/step${stepNum}.png`;
  }
}
