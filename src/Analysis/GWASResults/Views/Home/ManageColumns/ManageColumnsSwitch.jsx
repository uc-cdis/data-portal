const ManageColumnsSwitch = ({}) => (
  <div
    role='button'
    tabIndex={0}
    onKeyPress={() => toggleColumn('showRunId')}
    className='dropdown-row run-id'
    onClick={(event) => {
      event.stopPropagation();
      toggleColumn('showRunId');
    }}
  >
    <HolderIcon /> Run ID
    <div className='manage-columns-switch'>
      <Switch
        size='small'
        checked={homeTableState.columnManagement.showRunId}
      />
    </div>
  </div>
);
