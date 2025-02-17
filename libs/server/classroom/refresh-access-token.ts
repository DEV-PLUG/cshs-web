import CryptoJS from 'crypto-js';

export default async function refreshAccessToken(email:string):Promise<any> {
  const google = await client?.google.findMany({
    where: {
      user: {
        email: email
      }
    },
    select: {
      accessToken: true,
      refreshToken: true,
      expire: true,
      userId: true
    }
  });

  if(!google || google.length <= 0) return;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLASSROOM_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLASSROOM_CLIENT_SECRET!,
      refresh_token: CryptoJS.AES.decrypt(google[0].refreshToken, process.env.CLASSROOM_CRYPTO_KEY!).toString(CryptoJS.enc.Utf8),
      grant_type: 'refresh_token'
    })
  });

  if (!response.ok) {
    console.log(response, 'Error on Refresh Access Token');
    try {
      // await client?.google.delete({
      //   where: {
      //     userId: google[0].userId
      //   }
      // });
    }
    catch(err) {
      console.log(err, 'Error on Refresh Access Token')
    }
    return;
  };

  const tokenData = await response.json();
  await client?.google.update({
    where: {
      userId: google[0].userId
    },
    data: {
      accessToken: CryptoJS.AES.encrypt(tokenData.access_token, process.env.CLASSROOM_CRYPTO_KEY!).toString(),
      expire: new Date(Date.now() + tokenData.expires_in * 1000)
    }
  });

  return [{
    accessToken: tokenData.access_token,
    refreshToken: CryptoJS.AES.decrypt(google[0].refreshToken, process.env.CLASSROOM_CRYPTO_KEY!).toString(CryptoJS.enc.Utf8),
    success: true
  }];
}