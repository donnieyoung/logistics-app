﻿namespace Logistics.AdminApp.ViewModels.Pages.Cargo;

public class ListCargoViewModel : PageViewModelBase
{

    public ListCargoViewModel(IApiClient apiClient)
        : base(apiClient)
    {
        _cargoes = new List<CargoDto>();
    }

    private IList<CargoDto> _cargoes;
    public IList<CargoDto> Cargoes 
    {
        get => _cargoes;
        set => SetProperty(ref _cargoes, value);
    }

    private int _totalRecords;
    public int TotalRecords
    {
        get => _totalRecords;
        set => SetProperty(ref _totalRecords, value);
    }

    public override async Task OnInitializedAsync()
    {
        IsBusy = true;
        var pagedList = await FetchCargoes();
        Cargoes = pagedList.Items;
        TotalRecords = pagedList.TotalItems;
        IsBusy = false;
    }

    private Task<PagedDataResult<CargoDto>> FetchCargoes(int page = 1)
    {
        return Task.Run(async () =>
        {
            return await apiClient.GetCargoesAsync(page);
        });
    }
}