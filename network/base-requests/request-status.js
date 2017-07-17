/**
 * Created by Patrick on 01/06/2017.
 */
export  default class RequestStatus {}
RequestStatus.waiting = 'waiting';
RequestStatus.requesting = 'requesting';
RequestStatus.finish = 'finish';
Object.freeze(RequestStatus);// 冻结对象，防止修改