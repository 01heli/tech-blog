// SMS sending via Alibaba Cloud SMS.
// When SMS_MOCK=true, the verification code is printed to console instead.

export async function sendSmsCode(phone: string, code: string): Promise<void> {
  if (process.env.SMS_MOCK === 'true') {
    console.log(`[SMS MOCK] Verification code for ${phone}: ${code}`)
    return
  }

  // Production: use Alibaba Cloud SMS SDK
  // Requires: @alicloud/dysmsapi20170525, @alicloud/openapi-client
  // Uncomment when Alibaba Cloud credentials are configured:
  //
  // const Dysmsapi20170525 = await import('@alicloud/dysmsapi20170525')
  // const $OpenApi = await import('@alicloud/openapi-client')
  // const config = new $OpenApi.Config({
  //   accessKeyId: process.env.ALIBABA_ACCESS_KEY_ID!,
  //   accessKeySecret: process.env.ALIBABA_ACCESS_KEY_SECRET!,
  // })
  // config.endpoint = 'dysmsapi.aliyuncs.com'
  // const client = new Dysmsapi20170525(config)
  // const request = new Dysmsapi20170525.SendSmsRequest({
  //   phoneNumbers: phone,
  //   signName: process.env.ALIBABA_SMS_SIGN_NAME!,
  //   templateCode: process.env.ALIBABA_SMS_TEMPLATE_CODE!,
  //   templateParam: JSON.stringify({ code }),
  // })
  // await client.sendSms(request)
}
