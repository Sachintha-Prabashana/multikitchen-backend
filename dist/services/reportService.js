import prisma from '../lib/prisma.js';
export const getStockAnalytics = async () => {
    const items = await prisma.item.findMany({ include: { brand: true } });
    const totalItems = items.length;
    const totalStockValue = items.reduce((acc, item) => acc + (item.quantity * item.buying_price), 0);
    const totalSellingValue = items.reduce((acc, item) => acc + (item.quantity * item.selling_price), 0);
    return { totalItems, totalStockValue, totalSellingValue, items };
};
export const getDailyAnalytics = async (date) => {
    const searchDate = new Date(date || new Date());
    searchDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(searchDate);
    nextDay.setDate(searchDate.getDate() + 1);
    const transactions = await prisma.transaction.findMany({
        where: { date: { gte: searchDate, lt: nextDay } },
        include: { item: true },
    });
    const issues = transactions.filter(t => t.type === 'ISSUE');
    const receives = transactions.filter(t => t.type === 'RECEIVE');
    return { date: searchDate, issues, receives, totalIssues: issues.length, totalReceives: receives.length };
};
export const getMonthlyAnalytics = async (year, month) => {
    const start = new Date(year || new Date().getFullYear(), (month || new Date().getMonth() + 1) - 1, 1);
    const end = new Date(year || new Date().getFullYear(), (month || new Date().getMonth() + 1), 1);
    const transactions = await prisma.transaction.findMany({
        where: { date: { gte: start, lt: end } },
        include: { item: true },
    });
    const profit = transactions.reduce((acc, t) => {
        if (t.type === 'ISSUE') {
            const itemProfit = (t.item.selling_price - t.item.buying_price) * t.quantity;
            return acc + itemProfit;
        }
        return acc;
    }, 0);
    return { period: `${start.getMonth() + 1}/${start.getFullYear()}`, profit, transactionCount: transactions.length };
};
export const getAggregatedAnalytics = async () => {
    const items = await prisma.item.findMany();
    const totalItems = items.length;
    const totalStockValue = items.reduce((acc, item) => acc + (item.quantity * item.buying_price), 0);
    const totalSellingValue = items.reduce((acc, item) => acc + (item.quantity * item.selling_price), 0);
    const lowStockItems = items.filter(i => i.quantity <= i.min_quantity && i.quantity > 0).length;
    const outOfStockItems = items.filter(i => i.quantity === 0).length;
    const healthyStockItems = totalItems - lowStockItems - outOfStockItems;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const recentTransactions = await prisma.transaction.findMany({
        where: { date: { gte: sevenDaysAgo } },
        include: { item: true }
    });
    const trendData = {};
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        trendData[dateStr] = { date: dateStr, issues: 0, receives: 0 };
    }
    recentTransactions.forEach(t => {
        const dateStr = t.date.toISOString().split('T')[0];
        if (trendData[dateStr]) {
            if (t.type === 'ISSUE')
                trendData[dateStr].issues += t.quantity;
            else
                trendData[dateStr].receives += t.quantity;
        }
    });
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const topTransactions = await prisma.transaction.findMany({
        where: { type: 'ISSUE', date: { gte: thirtyDaysAgo } },
        include: { item: true }
    });
    const movementMap = {};
    topTransactions.forEach(t => {
        if (!movementMap[t.item_id])
            movementMap[t.item_id] = { name: t.item.item_name, count: 0 };
        movementMap[t.item_id].count += t.quantity;
    });
    const topMoving = Object.values(movementMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    return {
        summary: { totalItems, totalStockValue, totalSellingValue, healthyStockItems, lowStockItems, outOfStockItems },
        trends: Object.values(trendData).reverse(),
        topMoving
    };
};
export const getTransactionsReportData = async (periodType, dateValue) => {
    const date = new Date(dateValue);
    let startDate, endDate;
    if (periodType === 'DAILY') {
        startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
    }
    else if (periodType === 'MONTHLY') {
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    else if (periodType === 'YEARLY') {
        startDate = new Date(date.getFullYear(), 0, 1);
        endDate = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
    }
    else {
        // Default to last 30 days if not specified
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        endDate = new Date();
    }
    const transactions = await prisma.transaction.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            item: { include: { brand: true } },
            user: true,
        },
        orderBy: { date: 'desc' },
    });
    return transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        `${t.item.item_name} [${t.item.brand?.name || 'GENERIC'}]`,
        t.type,
        t.quantity,
        t.type === 'ISSUE' ? t.worker_name || 'N/A' : t.user.name,
        (t.quantity * (t.type === 'ISSUE' ? t.item.selling_price : t.item.buying_price)).toLocaleString()
    ]);
};
