import { ChainId } from '@portkey/types';
import { OperationTypeEnum } from '@portkey/services';

export interface IVerifyEntryParams {
  guardian: {
    guardianType: string;
    identifier?: string;
    thirdPartyEmail?: string;
  };
  originChainId?: ChainId;
  targetChainId?: ChainId;
  operationType: OperationTypeEnum;
  symbol?: string;
  amount?: string;
}

export const translateOperationEnumToStr = (enumPtr: OperationTypeEnum) => {
  switch (enumPtr) {
    case OperationTypeEnum.register: {
      return 'Create AA Address';
    }
    case OperationTypeEnum.communityRecovery: {
      return 'Social Recovery';
    }

    case OperationTypeEnum.addGuardian: {
      return 'Add Guardian';
    }
    case OperationTypeEnum.deleteGuardian: {
      return 'Remove Guardian';
    }
    case OperationTypeEnum.editGuardian: {
      return 'Update Guardian';
    }
    case OperationTypeEnum.removeOtherManager: {
      return 'Remove Device';
    }
    case OperationTypeEnum.setLoginAccount: {
      return 'Set Login Account';
    }
    case OperationTypeEnum.managerApprove: {
      return 'Approve';
    }
    case OperationTypeEnum.modifyTransferLimit: {
      return 'Set Transfer Limit';
    }
    case OperationTypeEnum.transferApprove: {
      return 'Guardian Approve Transfer';
    }
    case OperationTypeEnum.unsetLoginAccount: {
      return 'Unset Login Account';
    }

    default:
    case OperationTypeEnum.unknown: {
      return 'Unknown';
    }
  }
};

export const isInWarningWhiteList = (enumPtr: OperationTypeEnum) =>
  enumPtr !== OperationTypeEnum.managerApprove &&
  enumPtr !== OperationTypeEnum.transferApprove &&
  enumPtr !== OperationTypeEnum.modifyTransferLimit;

export const getCountry = async (serviceUrl: string) => {
  const data = await fetch(`${serviceUrl}/api/app/ipInfo/ipInfo`);
  return (await data.json()).country;
};
