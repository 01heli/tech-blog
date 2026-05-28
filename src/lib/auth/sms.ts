export async function sendSms(phone: string, code: string): Promise<boolean> {
  if (process.env.SMS_MOCK === 'true') {
    console.log(`[SMS MOCK] To: ${phone}, Code: ${code}`);
    return true;
  }

  try {
    // Dynamic import with Function() to avoid webpack build-time resolution
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const smsModule: any = await (new Function('m', 'return import(m)'))('@alicloud/dysmsapi20170525');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openapiModule: any = await (new Function('m', 'return import(m)'))('@alicloud/openapi-client');

    const Dysmsapi20170525 = smsModule.default;
    const $Dysmsapi20170525 = smsModule;
    const $OpenApi = openapiModule;

    const config = new $OpenApi.Config({
      accessKeyId: process.env.ALIBABA_ACCESS_KEY_ID!,
      accessKeySecret: process.env.ALIBABA_ACCESS_KEY_SECRET!,
    });
    config.endpoint = 'dysmsapi.aliyuncs.com';
    const client = new Dysmsapi20170525(config);

    await client.sendSms(
      new $Dysmsapi20170525.SendSmsRequest({
        phoneNumbers: phone,
        signName: process.env.ALIBABA_SMS_SIGN_NAME!,
        templateCode: process.env.ALIBABA_SMS_TEMPLATE_CODE!,
        templateParam: JSON.stringify({ code }),
      })
    );
    return true;
  } catch (error) {
    console.error('SMS send failed:', error);
    return false;
  }
}

export function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
