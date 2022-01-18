export type JtiData = {
  exp: number;
  jti: string;
};

export type UserProfileState = {
  create_error: any;
  delete_error: any;
  jtis: JtiData[];
  refreshCred: {
    api_key: string;
    key_id: string;
    refreshCred: string;
  };
  requestDeleteJTI: JtiData['jti'];
  requestDeleteExp: JtiData['exp'];
  request_delete_key: any;
  strRefreshCred: string;
  userProfile_error: any;
};
