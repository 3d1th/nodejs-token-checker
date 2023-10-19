const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');

const TOKEN_FILE_PATH = 'token.txt';
const VALID_FILE_PATH = 'valid.txt';
const INVALID_FILE_PATH = 'invalid.txt';

const checkToken = async (token) => {
    try {
        const response = await axios({
            method: "GET",
            url: "https://discord.com/api/v8/users/@me",
            headers: {
                authorization: token
            }
        });

        const user = response.data;
        console.log(chalk.green(`✅ ${token.slice(0, -12)}************의 토큰이 일치함 | ${user.username} | ${user.id}`));
        return token;
    } catch (error) {
        console.log(chalk.red(`❌ ${token.slice(0, -12)}************의 토큰이 일치하지 않음`));
        return null;
    }
};

const checkTokens = async () => {
    if (!fs.existsSync(TOKEN_FILE_PATH)) {
        console.log(chalk.red(`Error: ${TOKEN_FILE_PATH} file does not exist.`));
        return;
    }

    const tokens = fs.readFileSync(TOKEN_FILE_PATH, 'utf-8')
                     .split('\n')
                     .map(line => line.trim())
                     .filter(Boolean);

    const validTokens = [];
    const invalidTokens = [];

    for (const token of tokens) {
        const result = await checkToken(token);
        if (result) {
            validTokens.push(result);
        } else {
            invalidTokens.push(token);
        }
    }

    fs.writeFileSync(VALID_FILE_PATH, validTokens.join('\n'));
    fs.writeFileSync(INVALID_FILE_PATH, invalidTokens.join('\n'));
};

checkTokens();
