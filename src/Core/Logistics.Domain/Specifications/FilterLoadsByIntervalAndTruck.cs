﻿namespace Logistics.Domain.Specifications;

public class FilterLoadsByIntervalAndTruck : BaseSpecification<Load>
{
    public FilterLoadsByIntervalAndTruck(string truckId, DateOnly startPeriod, DateOnly endPeriod)
    {
        Criteria = i =>
            i.AssignedTruckId == truckId &&
            i.DeliveryDate.HasValue && i.DeliveryDate >= startPeriod && i.DeliveryDate <= endPeriod;

        OrderBy = i => i.DeliveryDate!;
    }
}