import { readDir, readFile, writeFile, fileOfType } from '../index';

const nonFlattened = [
  '__test__/myDir/myMarkdown.md',
  ['__test__/myDir/myOtherDir/nested.js'],
  '__test__/myDir/sampleFile.js',
  '__test__/myDir/sampleFile2.js',
];

let consoleSpy;

describe('file action utilities', () => {
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  // readDir
  it('Will read from current dirctory if no path is provided', async () => {
    const files = await readDir();
    expect(files[1]).toEqual(
      '/Users/conner/dev/personal/file-actions/.gitignore'
    );
  });

  it('can read files from a directory', async () => {
    const files = await readDir('__test__/myDir');
    expect(files).toEqual(nonFlattened);
  });

  it('can read files from a directory and return flattened array', async () => {
    const files = await readDir('__test__/myDir', true);
    expect(files).toEqual(nonFlattened.flat(Infinity));
  });

  it('logs an error without throwing exception if dir does not exist', async () => {
    readDir('__test__/myFakeDir');
    expect(consoleSpy).toHaveBeenCalled();
  });

  // readFile
  it('reads from test file', async () => {
    const files = await readFile('__test__/myDir/myMarkdown.md');
    expect(files.toString('utf-8')).toEqual('# This is me\n');
  });

  it('logs an error without throwing exception if dir does not exist', async () => {
    await readFile('__test__/myFakeDir/fakeFile.txt');
    expect(consoleSpy).toHaveBeenCalled();
  });

  // writeFile
  it('logs an error without throwing exception if dir does not exist', async () => {
    const returnValue = await writeFile('__test__/myFakeDir/fakeFile.txt');
    expect(returnValue).toBeFalsy();
    expect(consoleSpy).toHaveBeenCalled();
  });

  // fileOfType
  it('uses default file type  and returns an array with 4 items', async () => {
    const returnValue = await readDir('__test__/myDir').then((files) =>
      fileOfType(files)
    );
    expect(returnValue.length).toEqual(3);
  });

  it('returns false if non array is passed as argument', async () => {
    const returnValue = await fileOfType('__test__/myFakeDir/fakeFile.txt');
    expect(returnValue).toBeFalsy();
  });
});
