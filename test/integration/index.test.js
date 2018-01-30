import { execFile } from 'child-process-promise';
import { readdirSync, readFile, statSync } from 'fs-extra';
import { basename, resolve } from 'path';

const runElmPath = resolve(__dirname, '../../lib/index.js');
const projectBaseDir = resolve(__dirname, 'case-projects');

describe('run-elm', () => {
  const projectDirs = readdirSync(projectBaseDir)
    .map(filename => resolve(projectBaseDir, filename))
    .filter(path => statSync(path).isDirectory());

  projectDirs.forEach((projectDir) => {
    const projectName = basename(projectDir);

    test(`correctly works for case project \`${projectName}\``, async (done) => {
      const inputPath = resolve(projectDir, 'input.txt');
      const input = (await readFile(inputPath, 'utf-8')).trim().split(' ');
      const expectedOutput = await readFile(resolve(projectDir, 'output.txt'), 'utf-8');

      try {
        const { stdout } = await execFile(runElmPath, input, { cwd: projectDir });
        expect(stdout).toEqual(expectedOutput);
        done();
      } catch ({ code, stderr }) {
        done.fail(`process timeout or non-zero exit code ${code}${stderr ? `: ${stderr}` : ''}`);
      }
    }, 30000);
  });
});
