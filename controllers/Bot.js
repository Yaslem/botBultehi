import prisma from "../db.js";

const sendResponseServer = (status, code, message, data) => {
    return {
        data: data,
        status: status ? "success" : "error",
        code: code || 400,
        message: message || "لا توجد بيانات."
    }
}

export const SELECT_DATA_FOR_RESULT = {
    id: true,
    degree: true,
    decision: true,
    rankingInCountry: true,
    rankingInState: true,
    rankingInCounty: true,
    rankingInSchool: true,
    rankingInCenter: true,
    student: {
        select: {
            id: true,
            number: true,
            name: true,
            birth: true,
        }
    },
    session: {
        select: {
            id: true,
            name: true,
            slug: true,
        }
    },
    year: {
        select: {
            id: true,
            name: true,
        }
    },
    state: {
        select: {
            id: true,
            name: true,
        }
    },
    county: {
        select: {
            id: true,
            name: true,
        }
    },
    school: {
        select: {
            id: true,
            name: true,
        }
    },
    center: {
        select: {
            id: true,
            name: true,
        }
    },
    type: {
        select: {
            id: true,
            nameAr: true,
            nameFr: true,
        }
    },
    typeResult: {
        select: {
            id: true,
            name: true,
            slug: true,
        }
    },
    result: {
        select: {
            id: true,
            title: true,
            isPublished: true,
            hasStates: true,
            hasSchools: true,
            hasCenters: true,
            hasCounties: true,
            hasTypes: true,
        }
    }
}

export const getCategories =  async () => {
    const types = await prisma.reslutType.findMany({
        select: {
            id: true,
            name: true,
            slug: true
        },
        orderBy: {
            slug: 'asc',
        },
    })
    if(types.length > 0){
        return sendResponseServer(true, 200,"تم جلب البيانات بنجاح.", types)
    }
    return sendResponseServer(false, 400,"لا توجد بيانات.")
}

export const getYears =  async () => {
    const years = await prisma.year.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true
        },
        orderBy: {
            name: 'desc',
        },
    })
    if(years.length > 0){
        return sendResponseServer(true, 200,"تم جلب البيانات بنجاح.", years)
    }
    return sendResponseServer(false, 400,"لا توجد بيانات.")
}
export const getSessions =  async () => {
    const sessions = await prisma.session.findMany({
        select: {
            id: true,
            name: true,
            slug: true
        },
        orderBy: {
            slug: 'asc',
        },
    })
    if(sessions.length > 0){
        return sendResponseServer(true, 200,"تم جلب البيانات بنجاح.", sessions)
    }
    return sendResponseServer(false, 400,"لا توجد بيانات.")
}
export async function getTypes() {
    const types = await prisma.bacType.findMany({
        select: {
            id: true,
            nameFr: true,
            nameAr: true,
        },
    })

    if(types.length > 0){
        return sendResponseServer(true, 200, "تم جلب الشعب بنجاح", types)
    }
    return sendResponseServer(false, 400, "لا توجد شعب")
}

export async function getPublicExceptions(){
    const exceptions = await prisma.exception.findMany({
        where: {
            applied: true
        },
        include: {
            year: true,
            type: true,
            result: true
        },
        orderBy: {
            year: {
                name: 'desc',
            }
        },
    })
    if(exceptions.length > 0){
        return sendResponseServer(true, 200,"تم جلب الاستناءات بنجاح", exceptions)
    }
    return sendResponseServer(false, 200,"لا توجد بيانات.")
}

export async function getResultStudent({year, type, category, session, number}) {
    const result = await prisma.resultStudent.findFirst({
        where: {
            typeResult: {
              slug: category
            },
            type: {
              nameAr: type
            },
            session: {
              name: session
            },
            year: {
                name: year
            },
            student: {
                number: parseInt(number),
            }
        },
        select: SELECT_DATA_FOR_RESULT,
    })
    if(result){
        return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", result)
    }
    return sendResponseServer(false, 400, `لم نتمكن من العثور على ${number}، رجاء حاول مرة أخرى.`)

}