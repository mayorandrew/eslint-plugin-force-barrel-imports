import {RuleTester, InvalidTestCase, ValidTestCase} from '@typescript-eslint/rule-tester';
import rule from "../src/rule";
import path from "node:path";

const tester = new RuleTester({
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      typescript: true,
      node: true
    }
  }
});


const fixturesDir = path.join(__dirname, '__fixtures__');
const project = path.join(fixturesDir, 'project');

type Valid = ValidTestCase<[]>;
type Invalid = InvalidTestCase<'forbidden'|'parent', []>;

function testCase(file: string, from: string) {
  return {
    name: `import ${from} from ${file}`,
    code: `import a from '${from}'`,
    filename: path.join(project, file),
  } satisfies Valid;
}

function testErr(file: string, from: string, errModule: string, errBarrel: string) {
  return {
    ...testCase(file, from),
    errors: [{messageId: 'forbidden' as const, data: { module: errModule, barrel: errBarrel }}]
  } satisfies Invalid;
}

function testErrParent(file: string, from: string) {
  return {
    ...testCase(file, from),
    errors: [{messageId: 'parent' as const}]
  } satisfies Invalid;
}

const f0 = 'f0.ts';
const f1 = 'd1/f1.ts';
const f2 = 'd2/f2.ts';
const f3 = 'm1/f3.ts';
const f4 = 'm2/f4.ts';
const f5 = 'm1/m4/f5.ts';
const f6 = 'm2/m5/f6.ts';
const f7 = 'm1/m6/f7.ts';
const f8 = 'm2/m7/f8.ts';
const f9 = 'm1/d3/f9.ts';
const f10 = 'd1/m8/f10.ts';
const f11 = 'd2/m9/f11.ts';
const f12 = 'm1/d4/f12.ts';
const m1index = 'm1/index.ts';
const m2index = 'm2/index.ts';
const m4index = 'm1/m4/index.ts';
const m5index = 'm2/m5/index.ts';
const m6index = 'm1/m6/index.ts';
const m7index = 'm2/m7/index.ts';
const m8index = 'd1/m8/index.ts';
const m9index = 'd2/m9/index.ts';

const prefix = (x: string) => x.startsWith('.') ? x : './' + x;

function testFile(a: string, b: string, errBarrel?: string | 'parent') {
  const rel = path.relative(path.dirname(a), b);
  if (errBarrel === 'parent') {
    return testErrParent(a, prefix(rel));
  } else if (errBarrel) {
    return testErr(a, prefix(rel), b, errBarrel);
  }
  return testCase(a, prefix(rel))
}

const tests: (Valid | Invalid)[] = [
  testFile(f0, f1),
  testFile(f0, f2),
  testFile(f0, f3, 'm1/index.ts'),
  testFile(f0, f4, 'm2/index.ts'),
  testFile(f0, f5, 'm1/index.ts'),
  testFile(f0, f6, 'm2/index.ts'),
  testFile(f0, f7, 'm1/index.ts'),
  testFile(f0, f8, 'm2/index.ts'),
  testFile(f0, f9, 'm1/index.ts'),
  testFile(f0, f10, 'd1/m8/index.ts'),
  testFile(f0, f11, 'd2/m9/index.ts'),
  testFile(f0, f12, 'm1/index.ts'),
  testFile(f0, m1index),
  testFile(f0, m2index),
  testFile(f0, m8index),
  testFile(f0, m9index),
  testFile(f0, m4index, 'm1/index.ts'),
  testFile(f0, m5index, 'm2/index.ts'),
  testFile(f0, m6index, 'm1/index.ts'),
  testFile(f0, m7index, 'm2/index.ts'),

  testFile(f1, f0),
  testFile(f1, f2),
  testFile(f1, f3, 'm1/index.ts'),
  testFile(f1, f4, 'm2/index.ts'),
  testFile(f1, f5, 'm1/index.ts'),
  testFile(f1, f6, 'm2/index.ts'),
  testFile(f1, f7, 'm1/index.ts'),
  testFile(f1, f8, 'm2/index.ts'),
  testFile(f1, f9, 'm1/index.ts'),
  testFile(f1, f10, 'd1/m8/index.ts'),
  testFile(f1, f11, 'd2/m9/index.ts'),
  testFile(f1, f12, 'm1/index.ts'),
  testFile(f1, m1index),
  testFile(f1, m2index),
  testFile(f1, m8index),
  testFile(f1, m9index),
  testFile(f1, m4index, 'm1/index.ts'),
  testFile(f1, m5index, 'm2/index.ts'),
  testFile(f1, m6index, 'm1/index.ts'),
  testFile(f1, m7index, 'm2/index.ts'),

  testFile(f2, f0),
  testFile(f2, f1),
  testFile(f2, f3, 'm1/index.ts'),
  testFile(f2, f4, 'm2/index.ts'),
  testFile(f2, f5, 'm1/index.ts'),
  testFile(f2, f6, 'm2/index.ts'),
  testFile(f2, f7, 'm1/index.ts'),
  testFile(f2, f8, 'm2/index.ts'),
  testFile(f2, f9, 'm1/index.ts'),
  testFile(f2, f10, 'd1/m8/index.ts'),
  testFile(f2, f11, 'd2/m9/index.ts'),
  testFile(f2, f12, 'm1/index.ts'),
  testFile(f2, m1index),
  testFile(f2, m2index),
  testFile(f2, m8index),
  testFile(f2, m9index),
  testFile(f2, m4index, 'm1/index.ts'),
  testFile(f2, m5index, 'm2/index.ts'),
  testFile(f2, m6index, 'm1/index.ts'),
  testFile(f2, m7index, 'm2/index.ts'),

  testFile(f3, f0),
  testFile(f3, f1),
  testFile(f3, f2),
  testFile(f3, f4, 'm2/index.ts'),
  testFile(f3, f5, 'm1/m4/index.ts'),
  testFile(f3, f6, 'm2/index.ts'),
  testFile(f3, f7, 'm1/m6/index.ts'),
  testFile(f3, f8, 'm2/index.ts'),
  testFile(f3, f9),
  testFile(f3, f10, 'd1/m8/index.ts'),
  testFile(f3, f11, 'd2/m9/index.ts'),
  testFile(f3, f12),
  testFile(f3, m1index, 'parent'),
  testFile(f3, m2index),
  testFile(f3, m8index),
  testFile(f3, m9index),
  testFile(f3, m4index),
  testFile(f3, m5index, 'm2/index.ts'),
  testFile(f3, m6index),
  testFile(f3, m7index, 'm2/index.ts'),

  testFile(f4, f0),
  testFile(f4, f1),
  testFile(f4, f2),
  testFile(f4, f3, 'm1/index.ts'),
  testFile(f4, f5, 'm1/index.ts'),
  testFile(f4, f6, 'm2/m5/index.ts'),
  testFile(f4, f7, 'm1/index.ts'),
  testFile(f4, f8, 'm2/m7/index.ts'),
  testFile(f4, f9, 'm1/index.ts'),
  testFile(f4, f10, 'd1/m8/index.ts'),
  testFile(f4, f11, 'd2/m9/index.ts'),
  testFile(f4, f12, 'm1/index.ts'),
  testFile(f4, m1index),
  testFile(f4, m2index, 'parent'),
  testFile(f4, m8index),
  testFile(f4, m9index),
  testFile(f4, m4index, 'm1/index.ts'),
  testFile(f4, m5index),
  testFile(f4, m6index, 'm1/index.ts'),
  testFile(f4, m7index),

  testFile(f5, f0),
  testFile(f5, f1),
  testFile(f5, f2),
  testFile(f5, f3),
  testFile(f5, f4, 'm2/index.ts'),
  testFile(f5, f6, 'm2/index.ts'),
  testFile(f5, f7, 'm1/m6/index.ts'),
  testFile(f5, f8, 'm2/index.ts'),
  testFile(f5, f9),
  testFile(f5, f10, 'd1/m8/index.ts'),
  testFile(f5, f11, 'd2/m9/index.ts'),
  testFile(f5, f12),
  testFile(f5, m1index, 'parent'),
  testFile(f5, m2index),
  testFile(f5, m8index),
  testFile(f5, m9index),
  testFile(f5, m4index, 'parent'),
  testFile(f5, m5index, 'm2/index.ts'),
  testFile(f5, m6index),
  testFile(f5, m7index, 'm2/index.ts'),

  testFile(f6, f0),
  testFile(f6, f1),
  testFile(f6, f2),
  testFile(f6, f3, 'm1/index.ts'),
  testFile(f6, f4),
  testFile(f6, f5, 'm1/index.ts'),
  testFile(f6, f7, 'm1/index.ts'),
  testFile(f6, f8, 'm2/m7/index.ts'),
  testFile(f6, f9, 'm1/index.ts'),
  testFile(f6, f10, 'd1/m8/index.ts'),
  testFile(f6, f11, 'd2/m9/index.ts'),
  testFile(f6, f12, 'm1/index.ts'),
  testFile(f6, m1index),
  testFile(f6, m2index, 'parent'),
  testFile(f6, m8index),
  testFile(f6, m9index),
  testFile(f6, m4index, 'm1/index.ts'),
  testFile(f6, m5index, 'parent'),
  testFile(f6, m6index, 'm1/index.ts'),
  testFile(f6, m7index),

  testFile(f7, f0),
  testFile(f7, f1),
  testFile(f7, f2),
  testFile(f7, f3),
  testFile(f7, f4, 'm2/index.ts'),
  testFile(f7, f5, 'm1/m4/index.ts'),
  testFile(f7, f6, 'm2/index.ts'),
  testFile(f7, f8, 'm2/index.ts'),
  testFile(f7, f9),
  testFile(f7, f10, 'd1/m8/index.ts'),
  testFile(f7, f11, 'd2/m9/index.ts'),
  testFile(f7, f12),
  testFile(f7, m1index, 'parent'),
  testFile(f7, m2index),
  testFile(f7, m8index),
  testFile(f7, m9index),
  testFile(f7, m4index),
  testFile(f7, m5index, 'm2/index.ts'),
  testFile(f7, m6index, 'parent'),
  testFile(f7, m7index, 'm2/index.ts'),

  testFile(f8, f0),
  testFile(f8, f1),
  testFile(f8, f2),
  testFile(f8, f3, 'm1/index.ts'),
  testFile(f8, f4),
  testFile(f8, f5, 'm1/index.ts'),
  testFile(f8, f6, 'm2/m5/index.ts'),
  testFile(f8, f7, 'm1/index.ts'),
  testFile(f8, f9, 'm1/index.ts'),
  testFile(f8, f10, 'd1/m8/index.ts'),
  testFile(f8, f11, 'd2/m9/index.ts'),
  testFile(f8, f12, 'm1/index.ts'),
  testFile(f8, m1index),
  testFile(f8, m2index, 'parent'),
  testFile(f8, m8index),
  testFile(f8, m9index),
  testFile(f8, m4index, 'm1/index.ts'),
  testFile(f8, m5index),
  testFile(f8, m6index, 'm1/index.ts'),
  testFile(f8, m7index, 'parent'),

  testFile(f9, f0),
  testFile(f9, f1),
  testFile(f9, f2),
  testFile(f9, f3),
  testFile(f9, f4, 'm2/index.ts'),
  testFile(f9, f5, 'm1/m4/index.ts'),
  testFile(f9, f6, 'm2/index.ts'),
  testFile(f9, f7, 'm1/m6/index.ts'),
  testFile(f9, f8, 'm2/index.ts'),
  testFile(f9, f10, 'd1/m8/index.ts'),
  testFile(f9, f11, 'd2/m9/index.ts'),
  testFile(f9, f12),
  testFile(f9, m1index, 'parent'),
  testFile(f9, m2index),
  testFile(f9, m8index),
  testFile(f9, m9index),
  testFile(f9, m4index),
  testFile(f9, m5index, 'm2/index.ts'),
  testFile(f9, m6index),
  testFile(f9, m7index, 'm2/index.ts'),

  testFile(f10, f0),
  testFile(f10, f1),
  testFile(f10, f2),
  testFile(f10, f3, 'm1/index.ts'),
  testFile(f10, f4, 'm2/index.ts'),
  testFile(f10, f5, 'm1/index.ts'),
  testFile(f10, f6, 'm2/index.ts'),
  testFile(f10, f7, 'm1/index.ts'),
  testFile(f10, f8, 'm2/index.ts'),
  testFile(f10, f9, 'm1/index.ts'),
  testFile(f10, f11, 'd2/m9/index.ts'),
  testFile(f10, f12, 'm1/index.ts'),
  testFile(f10, m1index),
  testFile(f10, m2index),
  testFile(f10, m8index, 'parent'),
  testFile(f10, m9index),
  testFile(f10, m4index, 'm1/index.ts'),
  testFile(f10, m5index, 'm2/index.ts'),
  testFile(f10, m6index, 'm1/index.ts'),
  testFile(f10, m7index, 'm2/index.ts'),

  testFile(f11, f0),
  testFile(f11, f1),
  testFile(f11, f2),
  testFile(f11, f3, 'm1/index.ts'),
  testFile(f11, f4, 'm2/index.ts'),
  testFile(f11, f5, 'm1/index.ts'),
  testFile(f11, f6, 'm2/index.ts'),
  testFile(f11, f7, 'm1/index.ts'),
  testFile(f11, f8, 'm2/index.ts'),
  testFile(f11, f9, 'm1/index.ts'),
  testFile(f11, f10, 'd1/m8/index.ts'),
  testFile(f11, f12, 'm1/index.ts'),
  testFile(f11, m1index),
  testFile(f11, m2index),
  testFile(f11, m8index),
  testFile(f11, m9index, 'parent'),
  testFile(f11, m4index, 'm1/index.ts'),
  testFile(f11, m5index, 'm2/index.ts'),
  testFile(f11, m6index, 'm1/index.ts'),
  testFile(f11, m7index, 'm2/index.ts'),

  testFile(f12, f0),
  testFile(f12, f1),
  testFile(f12, f2),
  testFile(f12, f3),
  testFile(f12, f4, 'm2/index.ts'),
  testFile(f12, f5, 'm1/m4/index.ts'),
  testFile(f12, f6, 'm2/index.ts'),
  testFile(f12, f7, 'm1/m6/index.ts'),
  testFile(f12, f8, 'm2/index.ts'),
  testFile(f12, f9),
  testFile(f12, f10, 'd1/m8/index.ts'),
  testFile(f12, f11, 'd2/m9/index.ts'),
  testFile(f12, m1index, 'parent'),
  testFile(f12, m2index),
  testFile(f12, m8index),
  testFile(f12, m9index),
  testFile(f12, m4index),
  testFile(f12, m5index, 'm2/index.ts'),
  testFile(f12, m6index),
  testFile(f12, m7index, 'm2/index.ts'),
]

tester.run('force-barrel-imports', rule, {
  invalid: tests.filter((t): t is Invalid => 'errors' in t),
  valid: tests.filter((t): t is Valid => !('errors' in t))});

console.log('All tests passed!');
