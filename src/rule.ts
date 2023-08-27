import * as path from 'node:path';
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import resolve from 'eslint-module-utils/resolve';
import pkgUp from "eslint-module-utils/pkgUp";

const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`
);

const rule = createRule({
    name: 'force-barrel-imports',
    defaultOptions: [],
    meta: {
        type: 'problem',
        docs: {
            description: 'Forbids reaching out to modules hidden behind a barrel file (index.js/ts)',
        },
        messages: {
            forbidden: 'Reaching to the private module {{module}} is forbidden. Only importing from {{barrel}} is allowed.',
            parent: 'Reaching to the parent barrel file is forbidden. It will likely create a circular reference. Import the symbols from their definition files instead.'
        },
        schema: []
    },
    create(context) {
        function visit(node: TSESTree.ImportDeclaration | TSESTree.ExportNamedDeclaration | TSESTree.ExportAllDeclaration) {
            const currentFile = context.getPhysicalFilename?.() ?? context.getFilename();
            const currentDir = path.dirname(currentFile);
            const packageJson = pkgUp({ cwd: currentDir + '/' });
            if (!packageJson) return;

            const root = path.dirname(packageJson);
            const importPath = node.source?.value;
            if (!importPath) return;

            const targetFile = resolve(importPath, context);
            if (!targetFile) return;

            const targetDir = path.dirname(targetFile);
            const targetPackageJson = pkgUp({ cwd: targetDir + '/' });
            // Importing from a different package => can import
            if (packageJson !== targetPackageJson) return;

            function getBarrelFile(dirFromCurrent: string) {
                return resolve.relative('./' + dirFromCurrent, currentFile, context.settings);
            }

            // Current or target is outside root => can import
            if (path.relative(root, currentFile).startsWith('..') || path.relative(root, targetFile).startsWith('..')) return;

            const targetFromCurrent = path.relative(currentDir, targetFile);
            const parts = ['.', ...targetFromCurrent.split(path.sep)];
            for (let iPart = 0; iPart < parts.length - 1; iPart++) {
                const part = parts[iPart];
                const pathSoFar = parts.slice(0, iPart + 1).join(path.sep);
                const barrelFile = getBarrelFile(pathSoFar);
                if (barrelFile) {
                    if (part === '..' || part === '.') {
                        if (targetFile === barrelFile) {
                            // Importing parent barrel => cannot import
                            context.report({
                                node,
                                messageId: 'parent',
                            });
                            return;
                        }

                        // Reaching to the parent => possible, continue checking
                        continue;
                    }

                    if (targetFile === barrelFile) {
                        // Importing barrel file => can import
                        return;
                    }

                    // Importing non-barrel file => cannot import
                    context.report({
                        node,
                        messageId: 'forbidden',
                        data: {
                            module: path.relative(root, targetFile),
                            barrel: path.relative(root, barrelFile)
                        }
                    });
                    return;
                }

                // Not barrel folder => ignoring
            }

            // No barrels found on the path => same barrel scope => can import
        }

        return {
            ImportDeclaration: visit,
            ExportNamedDeclaration: visit,
            ExportAllDeclaration: visit
        }
    }
});

export default rule;
