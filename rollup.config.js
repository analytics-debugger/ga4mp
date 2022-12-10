import {babel} from '@rollup/plugin-babel';
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
const path = require('path');
const license = require('rollup-plugin-license');

const terserOptions = {
    compress: {
        passes: 2
    }
};

module.exports = [
    {
        input: "src/index.js",
        output: [                      
            {
                file: "dist/ga4mp.amd.js",
                format: "amd"
            },
            {
                file: "dist/ga4mp.amd.min.js",
                format: "amd",
                plugins: [terser(terserOptions)]
            },
            {
                file: "dist/ga4mp.iife.js",
                name: "ga4mp",
                format: "iife"
            },
            {
                file: "dist/ga4mp.iife.min.js",
                name: "ga4mp",
                format: "iife",
                plugins: [terser(terserOptions)]
            },
            {
                file: "dist/ga4mp.umd.js",
                name: "ga4mp",
                format: "umd"
            },
            {
                file: "dist/ga4mp.umd.min.js",
                name: "ga4mp",
                format: "umd",
                plugins: [terser(terserOptions)]
            }
        ],
        plugins: [
            license({
                banner: `/*!
* 
*   <%= pkg.name %> <%= pkg.version %>
*   https://github.com/analytics-debugger/ga4mp
*
*   Copyright (c) David Vallejo (https://www.thyngster.com).
*   This source code is licensed under the MIT license found in the
*   LICENSE file in the root directory of this source tree.
*
*/
`,
            }),            
            resolve(),
            babel({
                exclude: "node_modules/**"
            })
        ]
    },
    {
        input: "src/index.js",
        output: [
            {
                file: "dist/ga4mp.esm.js",
                format: "esm"
            },
            {
                file: "dist/ga4mp.esm.min.js",
                format: "esm",
                plugins: [terser(terserOptions)]
            }
        ]
    }
];
