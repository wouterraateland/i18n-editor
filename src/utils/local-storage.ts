export const storageAvailable = (type: "localStorage" | "sessionStorage") => {
  if (typeof window !== "object") return false;
  try {
    const storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    try {
      const storage = window[type];
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        storage &&
        storage.length !== 0
      );
    } catch (e) {
      return false;
    }
  }
};
