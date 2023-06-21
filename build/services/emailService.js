"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailToken = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ses = new client_ses_1.SESClient({
    region: "eu-west-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "hello",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "world",
    },
    apiVersion: "2010-12-01",
});
function createSendEmailCommand(toAddresses, fromAddress, message) {
    return new client_ses_1.SendEmailCommand({
        Destination: {
            ToAddresses: [toAddresses],
        },
        Source: fromAddress,
        Message: {
            Subject: {
                Charset: "UTF-8",
                Data: "Your one-time password",
            },
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: message,
                },
            },
        },
    });
}
function sendEmailToken(email, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = `Your one-time password: ${token}`;
        const command = createSendEmailCommand(email, "eske17.ea@gmail.com", message);
        try {
            return yield ses.send(command);
        }
        catch (error) {
            console.log("Error sending email", error);
            return error;
        }
    });
}
exports.sendEmailToken = sendEmailToken;
// sendEmailToken("eskew17.ea@gmail.com", "1234");
