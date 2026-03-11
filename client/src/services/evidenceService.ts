import api from "./api";

export const uploadEvidence = async (
  executionId: string,
  file: File
) => {

  const formData = new FormData();

  formData.append("test_execution", executionId);
  formData.append("file_type", "IMAGE");
  formData.append("file", file);

  return api.post("/evidences/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};