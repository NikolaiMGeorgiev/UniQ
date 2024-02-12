export const mapToCreateRoom = (formData, studentIds, id) => {
    const formDataEntries = Object.fromEntries(formData.entries());
    const getStringValue = (name) => name in formDataEntries ? String(formDataEntries[name]) : undefined;
    const type = (() => {
        if (!('type' in formDataEntries)) {
            return undefined;
        }
        const stringifiedValue = String(formDataEntries.type);
        if ('schedule' === stringifiedValue || 'queue' === stringifiedValue) {
            return stringifiedValue;
        }
        return undefined;
    })();
    const status = (() => {
        if (!('status' in formDataEntries)) {
            return undefined;
        }
        const stringifiedValue = String(formDataEntries.status);
        if (stringifiedValue === "not-started" || stringifiedValue === "active" || stringifiedValue === "break" || stringifiedValue === "closed") {
            return stringifiedValue;
        }
        return undefined;
    })();
    return {
        ...(id && { id }),
        name: getStringValue('name'),
        creatorId: getStringValue('creatorId'),
        startTime: getStringValue('startTime'),
        ...(type && { type }),
        ...(status && { status }),
        turnDuration: 'turnDuration' in formDataEntries ? Number(formDataEntries.turnDuration) : undefined,
        description: getStringValue('description'),
        studentIds,
    };
};
