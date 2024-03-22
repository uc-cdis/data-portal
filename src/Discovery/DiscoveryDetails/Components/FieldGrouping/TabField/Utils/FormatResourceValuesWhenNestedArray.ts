const FormatResourceValuesWhenNestedArray = (
  isTargetAListField: boolean = false,
  resourceFieldValue: string | any[],
) => {
  if (Array.isArray(resourceFieldValue)) {
    if (
      Array.isArray(resourceFieldValue[0])
        && resourceFieldValue[0].every((val) => typeof val === 'string')
    ) {
      return resourceFieldValue[0].join(', ');
    }
    if (isTargetAListField) {
      // to make sure the return value is a single-level array
      return resourceFieldValue.flat(Infinity);
    }
    return resourceFieldValue[0];
  }
  return resourceFieldValue;
};

export default FormatResourceValuesWhenNestedArray;
