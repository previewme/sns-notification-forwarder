import { handler } from '../src';
import * as simpleMessage from './events/event-simple-message.json';
import * as noSubjectMessage from './events/event-no-subject.json';
import * as cwAlarmMessage from './events/event-cloudwatch-alarm.json';
import * as noDetailType from './events/event-no-detail-type.json';

const mockPublish = jest.fn(() => {
    return {
        promise: jest.fn(() => Promise.resolve({ MessageId: '1', Sequence: '1' }))
    };
});

jest.mock('aws-sdk', () => {
    return {
        SNS: jest.fn(() => {
            return { publish: mockPublish };
        })
    };
});

describe('Handles various types of SNS messages', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        process.env = { ...OLD_ENV };
        process.env.AWS_REGION = 'us-east-1';
        process.env.SNS_ARN = 'arn:aws:sns:us-east-2:123456789012:MyTopic';
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('simple non json message', async () => {
        await handler(simpleMessage);

        expect(mockPublish).toHaveBeenCalledTimes(1);
        expect(mockPublish).toHaveBeenCalledWith({
            Message: 'example message',
            Subject: 'simple message',
            TopicArn: 'arn:aws:sns:us-east-2:123456789012:MyTopic'
        });
    });

    test('test message with no subject', async () => {
        await handler(noSubjectMessage);

        expect(mockPublish).toHaveBeenCalledTimes(1);
        expect(mockPublish).toHaveBeenCalledWith({
            Message: 'example message',
            Subject: 'None',
            TopicArn: 'arn:aws:sns:us-east-2:123456789012:MyTopic'
        });
    });

    test('test json message with detail type', async () => {
        await handler(cwAlarmMessage);

        expect(mockPublish).toHaveBeenCalledTimes(1);
        expect(mockPublish).toHaveBeenCalledWith({
            Message: JSON.parse(cwAlarmMessage.Records[0].Sns.Message),
            Subject: 'CloudWatch Alarm State Change',
            TopicArn: 'arn:aws:sns:us-east-2:123456789012:MyTopic'
        });
    });

    test('test json message without', async () => {
        await handler(noDetailType);

        expect(mockPublish).toHaveBeenCalledTimes(1);
        expect(mockPublish).toHaveBeenCalledWith({
            Message: JSON.parse(noDetailType.Records[0].Sns.Message),
            Subject: 'no detail type',
            TopicArn: 'arn:aws:sns:us-east-2:123456789012:MyTopic'
        });
    });
});
