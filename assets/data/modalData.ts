export interface ModalData {
  status: 'danger' | 'warning';
  regionName: string;
  regionLocation: string;
  equipmentCode: string;
  message?: string;
}

export const modalData: ModalData = {
  status: "warning",
  regionName: "A-1구역",
  regionLocation: "2층 자동차 부재료 조립구역",
  equipmentCode: "EQ-001",
  message: "현재 장비에서 이상음이 감지됩니다. 점검이 필요합니다."
};
