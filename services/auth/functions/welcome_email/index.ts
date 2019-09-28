import * as mail from '@sendgrid/mail';
import { DynamoDB } from 'aws-sdk';

const ddb = new DynamoDB.DocumentClient();

mail.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendWelcomeEmail(email: string, templateId: string) {
  const msg = {
    from: {
      email: 'notifications@refactordaily.com',
      name: 'Refactor Daily',
    },
    replyTo: {
      email: 'help@refactordaily.com',
      name: 'Refactor Daily',
      templateId,
      to: { email },
    },
  };
  console.log('sending mail:', msg);
  return mail.send(msg);
}

async function updatePendingFlag(userId: string) {
  console.log('removing welcomeEmailPending for user', userId);
  return ddb
    .update({
      ExpressionAttributeNames: {
        '#KEY1': 'welcomeEmailPending',
      },
      Key: {
        id: userId,
      },
      TableName: process.env.TABLE_REFACTOR!,
      UpdateExpression: 'REMOVE #KEY1',
    })
    .promise();
}

export const handler = async (event: any = {}): Promise<any> => {
  console.log('event:', event);

  const users = await ddb
    .query({
      ExpressionAttributeNames: {
        '#KEY1': 'welcomeEmailPending',
        '#KEY2': 'createdAt',
      },
      ExpressionAttributeValues: {
        ':value1': 'true',
        ':value2': new Date().getTime() - 600000, // 10 minutes ago
      },
      FilterExpression: '#KEY2 < :value2',
      IndexName: 'WelcomeEmailPendingIndex',
      KeyConditionExpression: '#KEY1 = :value1',
      ProjectionExpression: 'id, email, stripe.subscriptionId',
      TableName: process.env.TABLE_REFACTOR!,
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
