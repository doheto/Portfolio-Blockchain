// module.exports = function (api) {
//     api.cache(true);

//     const presets = [... ];
//     const plugins = [... ];

//     "plugins": [
//         ["import", { "libraryName": "antd", "libraryDirectory": "lib"}, "ant"],
//       ];
//     return {
//         presets,
//         plugins
//     };
// }



// "plugins": [
//     "styled-components"
//   ],
//   "presets": [
//     [
//       "env",
//       {
//         "modules": false
//       }
//     ],
//     "react",
//     "stage-0"
//   ],
//   "env": {
//     "production": {
//       "only": [
//         "app"
//       ],
//       "plugins": [
//         "transform-react-remove-prop-types",
//         "transform-react-constant-elements",
//         "transform-react-inline-elements"
//       ]
//     },
//     "test": {
//       "plugins": [
//         "transform-es2015-modules-commonjs",
//         "dynamic-import-node"
//       ]
//     }
//   }