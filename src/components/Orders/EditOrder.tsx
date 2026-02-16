import React from "react";

import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { cancelOrder } from "@/redux/slices/orderSlice";
import type { Order} from "@/types/order.type";
import { ORDER_STATUS_NAMES } from "@/types/order.type";

interface EditOrderProps {
  order: Order;
  toggleModal: (status: boolean) => void;
}

const EditOrder = ({ order, toggleModal }: EditOrderProps) => {
  const dispatch = useAppDispatch();
  const { cancelling } = useAppSelector((state) => state.orderReducer);

  const handleCancel = async () => {
    try {
      await dispatch(cancelOrder(order.id)).unwrap();
      toast.success("Đã hủy đơn hàng thành công");
      toggleModal(false);
    } catch (error: any) {
      toast.error(error || "Không thể hủy đơn hàng");
    }
  };

  // Can only cancel PENDING or CONFIRMED orders
  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";

  if (!canCancel) {
    return (
      <div className="w-full px-10 py-6 text-center">
        <p className="mb-4 text-dark">
          Không thể hủy đơn hàng ở trạng thái:{" "}
          <span className="font-bold">
            {ORDER_STATUS_NAMES[order.status] || order.status}
          </span>
        </p>
        <button
          className="rounded-[10px] border border-gray-3 bg-gray-1 py-2 px-6 text-dark hover:bg-gray-2"
          onClick={() => toggleModal(false)}
        >
          Đóng
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-10 py-6">
      <p className="pb-4 font-medium text-xl text-dark text-center">
        Hủy đơn hàng
      </p>
      <p className="text-center text-gray-600 mb-6">
        Bạn có chắc muốn hủy đơn hàng #{order.orderCode}?
      </p>

      <div className="flex gap-4 justify-center">
        <button
          className="rounded-[10px] border border-gray-3 bg-gray-1 py-3.5 px-5 text-custom-sm hover:bg-gray-2 transition"
          onClick={() => toggleModal(false)}
          disabled={cancelling}
        >
          Không, quay lại
        </button>

        <button
          className="rounded-[10px] border border-red bg-red text-white py-3.5 px-5 text-custom-sm hover:bg-red-dark transition disabled:opacity-50"
          onClick={handleCancel}
          disabled={cancelling}
        >
          {cancelling ? "Đang xử lý..." : "Xác nhận hủy"}
        </button>
      </div>
    </div>
  );
};

export default EditOrder;
