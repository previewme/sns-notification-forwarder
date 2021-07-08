import { SNSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';

const isEmpty = (str: string) => {
    return !str || str.length === 0;
};

export const handler = async (event: SNSEvent): Promise<void> => {
    let subject = event.Records[0].Sns.Subject;
    if (isEmpty(subject)) {
        subject = 'None';
    }

    let message = event.Records[0].Sns.Message;
    try {
        const jsonMessage = JSON.parse(message);
        if (!isEmpty(jsonMessage['detail-type'])) {
            subject = jsonMessage['detail-type'];
        }
        message = jsonMessage;
    } catch (error) {
        console.info('Not a JSON message');
    }
    const topicArn = process.env.SNS_ARN;
    const sns = new SNS({ region: process.env.AWS_REGION });
    const response = await sns.publish({ Message: message, Subject: subject, TopicArn: topicArn }).promise();
    console.info(response);
};
