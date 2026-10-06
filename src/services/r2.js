import api from "./api";

/**
 * يرفع أي ملف (صورة أو PDF) لـ R2 مباشرة من المتصفح
 * @param file الملف
 * @param type "cover" أو "pdf"
 * @param onProgress callback للتقدم
 * @returns الرابط النهائي
 */
export async function uploadToR2(file, type, onProgress) {
  const contentType = file.type || "application/oectet-stram";
  const extension = file.name.split(".").pop() || "bin";

  const { data } = await api.get("/admin/upload-url", {
    params: { type, contentType, extension },
  });
  const { uploadUrl, finalUrl } = data;

  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    
    // ✅ ابعت الـ Content-Type — دلوقتي مش موقع عليه فمفيش مشكلة
    xhr.setRequestHeader("Content-Type", contentType);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error("فشل الرفع لـ R2 (كود " + xhr.status + ")"));
    };

    xhr.onerror = () => reject(new Error("خطأ في الاتصال بـ R2"));
    xhr.timeout = 600000;
    xhr.ontimeout = () => reject(new Error("انتهت المهلة"));

    xhr.send(file);
  });

  return finalUrl;
}