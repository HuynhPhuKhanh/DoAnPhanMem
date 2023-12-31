/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { getListToS } from "../../../redux/typeOfStoreSlice";
import TextFields from "../../../components/TextField";
import SingleSelect from "../../../components/SingleSelect";
import { defaultStore } from "../../../constant";
import { createStore, updateStore } from "../../../redux/storeSlice";
import {
  apiGetPublicDistricts,
  apiGetPublicProvinces,
  apiGetPublicWards,
} from "../../../services/api.address";
import {
  convertDataDistrict,
  convertDataProvince,
  convertDataWard,
} from "../../../utils/helper";
import { getListPartner } from "../../../redux/partnerSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CreateEditStore({ isShow, handleCloseModal, data }) {
  const { ToSList } = useSelector((state) => state.typeOfStore);
  const { partnerList } = useSelector((state) => state.partner);
  const dispatch = useDispatch();
  const [formState, setFormState] = useState(defaultStore);
  const [validForm, setValidForm] = useState({
    partnerName: true,
    storeName: true,
    address: true,
    ward: true,
    district: true,
    province: true,
    tos: true,
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const validateForm = () => {
    let isValid = true;

    Object.keys(validForm).forEach((x) => {
      if (!formState[x] || formState[x].value <= 0) {
        isValid = false;
        validForm[x] = false;
      }
    });

    if (!isValid) {
      setValidForm({ ...validForm });
      return false;
    }

    return true;
  };

  const convertDataToS = (array) => {
    const DataList = array.map((item) => ({
      value: item.description,
      label: item.description,
    }));
    return DataList;
  };

  const convertDataPartner = (array) => {
    const DataList = array.map((item) => ({
      value: item.partnerName,
      label: item.partnerName,
    }));
    return DataList;
  };

  useEffect(() => {
    setFormState({ ...data });
  }, [data]);

  useEffect(() => {
    const fetchPublicProvince = async () => {
      const response = await apiGetPublicProvinces();
      if (response.status === 200) {
        setProvinces(response?.data.results);
      }
    };
    fetchPublicProvince();
  }, []);

  useEffect(() => {
    const fetchPublicDistrict = async () => {
      const response = await apiGetPublicDistricts(formState.province);
      if (response.status === 200) {
        setDistricts(response?.data.results);
      }
    };
    formState.province && fetchPublicDistrict(formState.province);
  }, [formState.province]);

  useEffect(() => {
    const fetchPublicWard = async () => {
      const response = await apiGetPublicWards(formState.district);
      if (response.status === 200) {
        setWards(response?.data.results);
      }
    };
    formState.district && fetchPublicWard(formState.district);
  }, [formState.district]);

  useEffect(() => {
    dispatch(getListToS());
  }, []);

  useEffect(() => {
    dispatch(getListPartner());
  }, []);

  const handleSubmitForm = (e) => {
    try {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const newData = {
        id: formState.id || undefined,
        partnerName: formState.partnerName,
        storeName: formState.storeName,
        address: formState.address,
        ward: formState.ward,
        district: formState.district,
        province: formState.province,
        tos: formState.tos,
      };

      formState.id === 0
        ? dispatch(createStore(newData))
        : dispatch(updateStore(newData));

      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setValidForm({ ...validForm });
  }, []);

  return (
    <div>
      <Modal open={isShow}>
        <Box sx={style}>
          <form onSubmit={handleSubmitForm}>
            <div className="flex justify-between">
              <div />
              <div className="text-xl font-bold text-center">
                Tạo mới Cửa hàng
              </div>
              <div
                className="cursor-pointer"
                onClick={() => handleCloseModal()}
              >
                <CloseIcon />
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <div>
                <SingleSelect
                  label="Tên đối tác"
                  width="500px"
                  options={convertDataPartner(partnerList)}
                  value={formState.partnerName}
                  onChange={(event) => {
                    setFormState({
                      ...formState,
                      partnerName: event.target.value,
                    });
                    setValidForm({ ...validForm, partnerName: true });
                  }}
                  required={true}
                  valid={validForm.partnerName}
                />
                <TextFields
                  label="Tên thương mại"
                  width="500px"
                  value={formState.storeName}
                  onChange={(event) => {
                    setFormState({
                      ...formState,
                      storeName: event.target.value,
                    });
                    setValidForm({
                      ...validForm,
                      storeName: !!event.target.value.trim(),
                    });
                  }}
                  required={true}
                  valid={validForm.storeName}
                />
                <div className="flex justify-between items-center">
                  <SingleSelect
                    label="Tỉnh/Thành phố"
                    width="240px"
                    options={convertDataProvince(provinces)}
                    value={formState.province}
                    onChange={(event) => {
                      setFormState({
                        ...formState,
                        province: event.target.value,
                      });
                      setValidForm({ ...validForm, province: true });
                    }}
                    required={true}
                    valid={validForm.province}
                  />
                  <SingleSelect
                    label="Quận/Huyện"
                    width="240px"
                    options={convertDataDistrict(districts)}
                    value={formState.district}
                    onChange={(event) => {
                      setFormState({
                        ...formState,
                        district: event.target.value,
                      });
                      setValidForm({ ...validForm, district: true });
                    }}
                    required={true}
                    valid={validForm.district}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <SingleSelect
                    label="Phường/Xã"
                    width="240px"
                    options={convertDataWard(wards)}
                    value={formState.ward}
                    onChange={(event) => {
                      setFormState({
                        ...formState,
                        ward: event.target.value,
                      });
                      setValidForm({ ...validForm, ward: true });
                    }}
                    required={true}
                    valid={validForm.ward}
                  />
                  <TextFields
                    label="Địa chỉ"
                    width="240px"
                    value={formState.address}
                    onChange={(event) => {
                      setFormState({
                        ...formState,
                        address: event.target.value,
                      });
                      setValidForm({
                        ...validForm,
                        address: !!event.target.value.trim(),
                      });
                    }}
                    required={true}
                    valid={validForm.address}
                  />
                </div>
                <SingleSelect
                  label="Loại cửa hàng"
                  width="500px"
                  options={convertDataToS(ToSList)}
                  value={formState.tos}
                  onChange={(event) => {
                    setFormState({
                      ...formState,
                      tos: event.target.value,
                    });
                    setValidForm({ ...validForm, tos: true });
                  }}
                  required={true}
                  valid={validForm.tos}
                />
              </div>
            </div>
            <div className="flex justify-end mt-10 gap-5">
              <button
                type="submit"
                className=" text-base font-bold bg-green-neon hover:bg-green-neon-hover w-32 h-10 rounded-lg  "
              >
                Lưu
              </button>
              <button
                onClick={() => handleCloseModal()}
                className=" text-base font-bold hover:bg-gray-200 w-32 h-10 rounded-lg border "
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
