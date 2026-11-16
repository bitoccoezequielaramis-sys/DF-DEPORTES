(function () {
    const { apiKey, projectId } = window.firebaseConfig;
    const documentsUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

    function decodeValue(value) {
        if ("stringValue" in value) return value.stringValue;
        if ("integerValue" in value) return Number(value.integerValue);
        if ("doubleValue" in value) return value.doubleValue;
        if ("booleanValue" in value) return value.booleanValue;
        if ("nullValue" in value) return null;
        if ("timestampValue" in value) return value.timestampValue;
        if ("referenceValue" in value) return value.referenceValue;
        if ("bytesValue" in value) return value.bytesValue;
        if ("geoPointValue" in value) return value.geoPointValue;
        if ("arrayValue" in value) return (value.arrayValue.values || []).map(decodeValue);
        if ("mapValue" in value) return decodeFields(value.mapValue.fields || {});
        return null;
    }

    function decodeFields(fields) {
        return Object.fromEntries(
            Object.entries(fields).map(([key, value]) => [key, decodeValue(value)])
        );
    }

    async function getDocument(collection, id) {
        const url = `${documentsUrl}/${encodeURIComponent(collection)}/${encodeURIComponent(id)}?key=${encodeURIComponent(apiKey)}`;
        const response = await fetch(url);

        if (response.status === 404) return null;
        if (!response.ok) {
            const details = await response.json().catch(() => ({}));
            const message = details.error?.message || response.statusText;
            throw new Error(`Firestore (${response.status}): ${message}`);
        }

        const document = await response.json();
        return {
            id: document.name.split("/").pop(),
            ...decodeFields(document.fields || {})
        };
    }

    window.firebaseFirestore = { getDocument };
})();
