declare module 'eslint-module-utils/resolve' {
  import type {RuleContext, SharedConfigurationSettings} from '@typescript-eslint/utils/ts-eslint';
  export const relative: (modulePath: string, sourceFile: string, settings: SharedConfigurationSettings) => string | null | undefined;
  declare const resolve: ((p: string, context: Readonly<RuleContext<string, unknown[]>>) => string | null | undefined) & {
    relative: typeof relative;
  };
  export default resolve;
}

declare module 'eslint-module-utils/pkgUp' {
  declare function pkgUp(opts: { cwd: string }): string | null;
  export default pkgUp;
}
