module.exports = {
    apps: [
        {
            name: 'app',
            // eslint-disable-next-line n/no-path-concat
            script: `${__dirname}/dist/main.js`,
            instances: 4,
            exec_mode: 'cluster',
        },
    ],
};
