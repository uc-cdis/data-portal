import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Space, Divider } from 'antd';
import {
  LinkOutlined,
  CheckOutlined,
  DoubleLeftOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import { hostname, studyRegistrationConfig } from '../../../../localconf';
import GetPermaLink from '../../Utils/GetPermaLink';
import { userHasMethodForServiceOnResource } from '../../../../authMappingUtils';

const HeaderButtons = ({ props, setTabActiveKey }) => {
  const history = useHistory();
  const handleRedirectClick = (
    redirectURL: string = '/',
    studyRegistrationAuthZ: string | null = null,
    studyName: string | null = null,
    studyNumber: string | null = null,
    studyUID: string | number | null = null,
    existingDataDictionaryName: Array<string> = [],
    existingCDEName: Array<string> = [],
  ) => {
    history.push(redirectURL, {
      studyName,
      studyNumber,
      studyRegistrationAuthZ,
      studyUID,
      existingDataDictionaryName,
      existingCDEName,
    });
  };
  const permalink = GetPermaLink(
    props.modalData[props.config.minimalFieldMapping.uid],
  );

  const handleRedirectToLoginClick = () => {
    history.push('/login', { from: permalink });
  };

  let requestButtonText = ' Login to Register This Study ';
  if (props.user.username) {
    if (
      userHasMethodForServiceOnResource(
        'access',
        'study_registration',
        props.modalData[
          studyRegistrationConfig?.studyRegistrationAccessCheckField
        ],
        props.userAuthMapping,
      )
    ) {
      requestButtonText = ' Register This Study ';
    } else {
      requestButtonText = ' Request Access to Register This Study ';
    }
  }

  const showRequestAccessButton = props.modalData[studyRegistrationConfig.studyRegistrationValidationField]
    && props.user.username
    && !userHasMethodForServiceOnResource(
      'access',
      'study_registration',
      props.modalData[
        studyRegistrationConfig.studyRegistrationAccessCheckField
      ],
      props.userAuthMapping,
    );

  const showSubmitVLMDButton = props.modalData[studyRegistrationConfig.studyRegistrationValidationField]
    && props.user.username
    && userHasMethodForServiceOnResource(
      'access',
      'study_registration',
      props.modalData[
        studyRegistrationConfig.studyRegistrationAccessCheckField
      ],
      props.userAuthMapping,
    );

  const showLoginButton = props.modalData[studyRegistrationConfig.studyRegistrationValidationField]
    && !props.user.username;
  return (
    <div className='discovery-modal__header-buttons'>
      <Button
        type='text'
        onClick={() => {
          props.setModalVisible(false);
          setTabActiveKey('0');
        }}
        className='discovery-modal__close-button'
      >
        <DoubleLeftOutlined />
        Back
      </Button>
      <Space split={<Divider type='vertical' />}>
        {props.modalData[
          studyRegistrationConfig.studyRegistrationValidationField
        ] === false ? (
            <Button
              type='text'
              className='discovery-modal__request-button'
              onClick={() => {
                if (props.user.username) {
                  if (
                    userHasMethodForServiceOnResource(
                      'access',
                      'study_registration',
                      props.modalData[
                        studyRegistrationConfig.studyRegistrationAccessCheckField
                      ],
                      props.userAuthMapping,
                    )
                  ) {
                    return handleRedirectClick(
                      '/study-reg',
                      props.modalData[
                        studyRegistrationConfig.studyRegistrationAccessCheckField
                      ],
                      props.modalData.study_metadata?.minimal_info?.study_name,
                      props.modalData.project_number,
                      props.modalData[
                        studyRegistrationConfig.studyRegistrationUIDField
                      ],
                    );
                  }
                  return handleRedirectClick(
                    '/study-reg/request-access',
                    props.modalData[
                      studyRegistrationConfig.studyRegistrationAccessCheckField
                    ],
                    props.modalData.study_metadata?.minimal_info?.study_name,
                    props.modalData.project_number,
                    props.modalData[
                      studyRegistrationConfig.studyRegistrationUIDField
                    ],
                  );
                }
                return handleRedirectToLoginClick();
              }}
            >
              <React.Fragment>
                <AuditOutlined />
                {requestButtonText}
              </React.Fragment>
            </Button>
          ) : null}
        {showSubmitVLMDButton ? (
          // user is authenticated, VLMD submission button should be visible only on registered studies that they have access to
          <Button
            type='text'
            className='discovery-modal__request-button'
            onClick={() => handleRedirectClick(
              '/vlmd-submission',
              props.modalData[
                studyRegistrationConfig.studyRegistrationAccessCheckField
              ],
              props.modalData.study_metadata?.minimal_info?.study_name,
              props.modalData.project_number,
              props.modalData[
                studyRegistrationConfig.studyRegistrationUIDField
              ],
              // get existing data dictionary names
              Object.keys(
                props.modalData[
                  studyRegistrationConfig.variableMetadataField
                ]?.data_dictionaries || {},
              ),
              // get existing CDE names
              Object.keys(
                props.modalData[
                  studyRegistrationConfig.variableMetadataField
                ]?.common_data_elements || {},
              ),
            )}
          >
            <AuditOutlined />
            Submit Variable-level Metadata
          </Button>
        ) : null}
        {showRequestAccessButton ? (
          <Button
            type='text'
            className='discovery-modal__request-button'
            onClick={() => handleRedirectClick(
              '/vlmd-submission/request-access',
              props.modalData[
                studyRegistrationConfig.studyRegistrationAccessCheckField
              ],
              props.modalData.study_metadata?.minimal_info?.study_name,
              props.modalData.project_number,
              props.modalData[
                studyRegistrationConfig.studyRegistrationUIDField
              ],
            )}
          >
            <AuditOutlined />
            Request Access to Submit Variable-level Metadata
          </Button>
        ) : null}

        {showLoginButton ? ( // user is NOT authenticated, Login in to VLMD submission button should be visible only on registered studies
          <Button type='text' onClick={() => handleRedirectToLoginClick()}>
            <AuditOutlined />
            Login to Submit Variable-level Metadata
          </Button>
        ) : null}
        <Button
          type='text'
          onClick={() => {
            navigator.clipboard
              .writeText(`${hostname}${permalink.replace(/^\/+/g, '')}`)
              .then(() => {
                props.setPermalinkCopied(true);
              });
          }}
        >
          {props.permalinkCopied ? (
            <React.Fragment>
              <CheckOutlined /> Copied!
            </React.Fragment>
          ) : (
            <React.Fragment>
              <LinkOutlined /> Permalink
            </React.Fragment>
          )}
        </Button>
      </Space>
    </div>
  );
};
export default HeaderButtons;
