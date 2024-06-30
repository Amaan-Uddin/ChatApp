module.exports = async function findOrCreate(db, query, data) {
	let doc = await db.findOne(query)
	let isNew = false
	if (!doc) {
		doc = await db.create(data)
		isNew = true
	}
	return { doc, isNew }
}
