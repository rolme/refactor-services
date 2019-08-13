import { DynamoDB } from 'aws-sdk';
import * as mail from '@sendgrid/mail';

const ddb = new DynamoDB.DocumentClient();

mail.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendWelcomeEmail(email: string, templateId: string) {
  const msg = {
    to: {
      email: email,
    },
    from: {
      name: 'Refactor Daily',
      email: 'notifications@refactordaily.com',
    },
    replyTo: {
      name: 'Refactor Daily',
      email: 'help@refactordaily.com',
    },
    templateId: templateId,
  };
  console.log('sending mail:', msg);
  return mail.send(msg);
}

async function updatePendingFlag(userId: string) {
  console.log('removing welcomeEmailPending for user', userId);
  return ddb
    .update({
      TableName: process.env.TABLE_USERS!,
      Key: {
        id: userId,
      },
      UpdateExpression: 'REMOVE #KEY1',
      ExpressionAttributeNames: {
        '#KEY1': 'welcomeEmailPending',
      },
    })
    .promise();
}

export const handler = async (event: any = {}): Promise<any> => {
  console.log('event:', event);

  const users = await ddb
    .query({
      TableName: process.env.TABLE_USERS!,
      IndexName: 'WelcomeEmailPendingIndex',
      KeyConditionExpression: '#KEY1 = :value1',
      FilterExpression: '#KEY2 < :value2',
      ExpressionAttributeNames: {
        '#KEY1': 'welcomeEmailPending',
        '#KEY2': 'createdAt',
      },
      ExpressionAttributeValues: {
        ':value1': 'true',
        ':value2': new Date().getTime() - 600000, // 10 minutes ago
      },
      ProjectionExpression: 'id, email, stripe.subscriptionId',
    })
    .promise()
    .catch((error) => console.log('error:', error.toString()));

  console.log('users:', JSON.stringify(users));

  if (users && users.Items) {
    for (const user of users.Items) {
      console.log('user:', user);
      let templateId = process.env.SENDGRID_TEMPLATE_WELCOME_TRIAL;
      if (user.stripe && user.stripe.subscriptionId) {
        templateId = process.env.SENDGRID_TEMPLATE_WELCOME_SUBSCRIBER;
      }
      if (templateId) {
        await sendWelcomeEmail(user.email, templateId)
          .then(() => {
            return updatePendingFlag(user.id);
          })
          .catch((error) => console.log('error:', error.toString()));
      }
    }
  }

  return event;
};
