import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
dotenv.config();

const ses = new SESClient({
  region: "eu-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "hello",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "world",
  },
  apiVersion: "2010-12-01",
});

function createSendEmailCommand(
  toAddresses: string,
  fromAddress: string,
  message: string
): SendEmailCommand {
  return new SendEmailCommand({
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

export async function sendEmailToken(email: string, token: string) {
  const message = `Your one-time password: ${token}`;
  const command = createSendEmailCommand(email, "eske17.ea@gmail.com", message);
  try {
    return await ses.send(command);
  } catch (error) {
    console.log("Error sending email", error);
    return error;
  }
}

// sendEmailToken("eskew17.ea@gmail.com", "1234");
