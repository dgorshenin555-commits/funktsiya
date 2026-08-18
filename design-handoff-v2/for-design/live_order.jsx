/* live_order.jsx — экран варианта Б, выгружен из основного проекта.
   Сгенерировано tools/reverse_transform.py: правки вносить в
   app/v2/_screens/ в проекте, иначе они разойдутся.
   Использует из lib_bundle.jsx: OBJECT_TYPE_LABELS, SCALE_LABELS, STAGE_LABELS, useApp.
   Подключать после lib_bundle.jsx. */
(function () {
  /* Деталь НАСТОЯЩЕЙ заявки из общего хранилища — этап 2 подключения варианта Б
     к данным (вопрос 14): отклик исполнителя (addResponse), выбор исполнителя
     владельцем (selectExecutor), статусы. Открывается из списка заявок для
     карточек с флагом live (и своих, и чужих). Вёрстка — на готовых классах Б
     (.page, .two, .box, .resp, .field, .inp). */
  const { useState } = React;

  const ini = s => (s || "").replace(/[^А-ЯA-Zа-яa-z]/g, "").slice(0, 2).toUpperCase() || "ЗК";
  const STATUS_RU = { published: "Опубликована", in_progress: "В работе", completed: "Завершена" };

  function LiveOrder({ go, orderId }) {
    const { user, getOrderById, getResponsesForOrder, addResponse, hasResponded, selectExecutor } = useApp();
    const [msg, setMsg] = useState("");
    const [price, setPrice] = useState("");
    const [note, setNote] = useState(null);

    const o = orderId ? getOrderById(orderId) : null;
    if (!o) return (
      <div className="scroll"><div className="wrap page">
        <button className="back" onClick={() => go("reqs")}>← К заявкам</button>
        <div className="box"><h3>Заявка не найдена</h3><p>Возможно, ссылка устарела или заявка удалена.</p></div>
      </div></div>
    );

    const isOwner = !!(user && user.id === o.customerId);
    const isDesigner = user && user.role === "designer";
    const responses = getResponsesForOrder(o.id);
    const responded = user ? hasResponded(o.id) : false;

    const send = () => {
      if (!msg.trim()) return;
      const digits = String(price).replace(/\D/g, "");
      const ok = addResponse({
        orderId: o.id,
        message: msg.trim(),
        proposedBudget: digits ? Number(digits).toLocaleString("ru-RU") + " ₽" : undefined,
      });
      setNote(ok ? "Отклик отправлен" : "Вы уже откликались на эту заявку");
      if (ok) { setMsg(""); setPrice(""); }
    };
    const pick = r => { selectExecutor(o.id, r.designerId, r.designerName); setNote("Исполнитель выбран: " + r.designerName); };

    return (
      <div className="scroll">
        <div className="wrap page">
          <button className="back" onClick={() => go("reqs")}>← К заявкам</button>
          <div className="page__h">
            <span className="lbl">Заявка · {STATUS_RU[o.status] || o.status}{isOwner ? " · ваша" : ""}</span>
            <h1>{o.title}</h1>
            {o.description && <p>{o.description}</p>}
          </div>
          <div className="two">
            <div style={{ display: "grid", gap: 14 }}>
              <div className="box">
                <h3>Параметры</h3>
                <div className="spec" style={{ borderTop: 0, paddingTop: 0, marginTop: 4 }}>
                  <div><span className="lbl">Тип объекта</span><b>{OBJECT_TYPE_LABELS[o.objectType] || o.objectType}</b></div>
                  <div><span className="lbl">Регион</span><b>{o.region}</b></div>
                  <div><span className="lbl">Стадия</span><b>{STAGE_LABELS[o.stage] || o.stage}</b></div>
                  <div><span className="lbl">Привлечение</span><b>{SCALE_LABELS[o.scale] || o.scale}</b></div>
                  <div><span className="lbl">Бюджет</span><b>{o.budget || "Ждём предложений"}</b></div>
                  <div><span className="lbl">Срок</span><b>{o.deadline ? "до " + o.deadline : "по согласованию"}</b></div>
                </div>
                <div className="row g8" style={{ flexWrap: "wrap", marginTop: 16 }}>
                  {(o.sections || []).map(s => <span className="tag" key={s}>{s}</span>)}
                </div>
              </div>

              <div className="box">
                <h3>Отклики · {responses.length}</h3>
                {responses.length === 0 && <p>Откликов пока нет.{isOwner ? " Исполнители увидят заявку в общем списке." : ""}</p>}
                <div style={{ display: "grid", gap: 10 }}>
                  {responses.map(r => (
                    <div className={"resp" + (o.assignedDesignerId === r.designerId ? " on" : "")} key={r.id} style={{ gridTemplateColumns: "auto minmax(0,1fr) auto" }}>
                      <span className="pini">{ini(r.designerName)}</span>
                      <div className="resp__b">
                        <div className="row g8" style={{ flexWrap: "wrap" }}>
                          <b>{r.designerName}</b>
                          {r.designerCompany && <span className="lbl">{r.designerCompany}</span>}
                          {o.assignedDesignerId === r.designerId && <span className="tag solid">исполнитель</span>}
                        </div>
                        <p>{r.message}</p>
                        {r.proposedBudget && <div className="resp__f"><span className="num big">{r.proposedBudget}</span></div>}
                      </div>
                      {isOwner && o.status === "published" && !o.assignedDesignerId && (
                        <div className="resp__a">
                          <button className="btn btn-acid btn-sm" onClick={() => pick(r)}>Выбрать</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div className="box">
                <span className="lbl">Заказчик</span>
                <div className="row g12" style={{ marginTop: 10 }}>
                  <span className="pini">{ini(o.customerName)}</span>
                  <b>{o.customerName}</b>
                </div>
              </div>

              {o.assignedDesignerName && (
                <div className="box">
                  <span className="lbl">Исполнитель</span>
                  <div className="row g12" style={{ marginTop: 10 }}>
                    <span className="pini">{ini(o.assignedDesignerName)}</span>
                    <div><b>{o.assignedDesignerName}</b><div className="lbl" style={{ marginTop: 3 }}>назначен по заявке</div></div>
                  </div>
                </div>
              )}

              {!isOwner && o.status === "published" && (
                <div className="box">
                  <h3>Оставить отклик</h3>
                  {!user ? (
                    <div style={{ display: "grid", gap: 12 }}>
                      <p>Чтобы откликнуться, войдите на платформу.</p>
                      <a className="btn btn-ink" href="/auth" style={{ textDecoration: "none" }}>Войти</a>
                    </div>
                  ) : !isDesigner ? (
                    <p>Откликаться на заявки могут исполнители-проектировщики.</p>
                  ) : responded ? (
                    <p>Вы уже откликнулись на эту заявку. Заказчик видит ваше предложение.</p>
                  ) : (
                    <div style={{ display: "grid", gap: 10 }}>
                      <textarea className="inp" rows={4} placeholder="Опишите ваш опыт и предложение…" value={msg} onChange={e => setMsg(e.target.value)} />
                      <input className="inp" placeholder="Предлагаемый бюджет, ₽ (необязательно)" value={price} onChange={e => setPrice(e.target.value)} />
                      <button className="btn btn-acid" disabled={!msg.trim()} style={{ opacity: msg.trim() ? 1 : 0.5 }} onClick={send}>Отправить отклик</button>
                    </div>
                  )}
                </div>
              )}

              {note && (
                <div className="noteline ok"><p><b>{note}</b></p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { LiveOrder });
})();
