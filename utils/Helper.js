class Helpers {
  static pagination(page, size = 10) {
    let limit = size;
    let offset = page ? (page - 1) * limit : 0;

    return { limit: parseInt(limit), offset: parseInt(offset) };
  }

  static pagingData(data, page, limit = 10) {
    const { count: modelCount, rows: content } = data;
    const currentPage = page ? 0 + page : 0;
    const totalPages = Math.ceil(modelCount / limit);

    return { modelCount, content, totalPages, currentPage };
  }

  static fetchResourceID(Payload) {
    if (Payload) {
      let Id = Payload.split("/")
        .filter((el) => (el !== "" ? true : false))
        .at(-1);
      return parseInt(Id);
    }

    return null;
  }

  static convertHeightToFeetAndInches(height) {
    let realFeet = (height * 0.3937) / 12;
    let feet = Math.floor(realFeet);
    let inches = Math.floor((realFeet - feet) * 12);

    return `${feet}ft and ${inches}inches.`;
  }
}

module.exports = Helpers;
